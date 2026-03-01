const express = require("express");
const user = require("../models/user");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment=require("../models/payment");
const User=require("../models/user");
const { membershipAmount } = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const {membershipType}=req.body;
    const {firstName,lastName,emailId}=req.user;
    const order= await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType]*100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      }
    });
   

    const payment= new Payment({
      userId:req.user._id,
      orderId:order.id,
      status:order.status,
      amount:order.amount,
      currency:order.currency,
      receipt:order.receipt,
      notes:order.notes,
    })
    const savedPayment= await payment.save();
    res.json({...savedPayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID});
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }

});
paymentRouter.post("/payment/webhook", async (req, res) => {
try { 
  
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(req.body.toString(), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
    if (!isWebhookValid) {
      return res.status(400).json({msg: "Webhook signature is not valid"});
    }
    const body = JSON.parse(req.body.toString());
    const paymentDetails = body.payload.payment.entity;
    const payment=await Payment.findOne({orderId:paymentDetails.order_id});
    payment.status=paymentDetails.status;
    await payment.save();

    const user= await User.findOne({_id:payment.userId});
    user.isPremium=true;
    user.membershipType=paymentDetails.notes.membershipType;
    await user.save();

    return res.status(200).json({msg: "Webhook received successfully"});
  }
catch (err) {   
    res.status(400).json({msg: err.message});
    }
  });

module.exports = paymentRouter;
