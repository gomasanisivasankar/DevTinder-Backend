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
// paymentRouter.post("/payment/webhook", async (req, res) => {
//   try {
//     // 1️⃣ Get signature from headers
//     const webhookSignature = req.headers["x-razorpay-signature"];

//     // 2️⃣ Validate webhook signature (using raw body)
//     const isValid = validateWebhookSignature(
//       req.body.toString(),
//       webhookSignature,
//       process.env.RAZORPAY_WEBHOOK_SECRET
//     );

//     if (!isValid) {
//       return res.status(400).json({ msg: "Invalid webhook signature" });
//     }

//     // 3️⃣ Parse raw body
//     const body = JSON.parse(req.body.toString());

//     // 4️⃣ Only process payment.captured event
//     if (body.event !== "payment.captured") {
//       return res.status(200).send("Event ignored");
//     }

//     const paymentDetails = body.payload.payment.entity;

//     // 5️⃣ Find payment in DB
//     const payment = await Payment.findOne({
//       orderId: paymentDetails.order_id,
//     });

//     if (!payment) {
//       return res.status(404).json({ msg: "Payment not found" });
//     }

//     // 6️⃣ Prevent duplicate execution
//     if (payment.status === "captured") {
//       return res.status(200).send("Already processed");
//     }

//     // 7️⃣ Update payment status
//     payment.status = paymentDetails.status;
//     await payment.save();

//     // 8️⃣ Upgrade user
//     const user = await User.findById(payment.userId);

//     if (user) {
//       user.isPremium = true;
//       user.membershipType = paymentDetails.notes.membershipType;
//       await user.save();
//     }

//     return res.status(200).json({ msg: "Webhook processed successfully" });

//   } catch (err) {
//     console.error("Webhook error:", err);
//     return res.status(500).json({ msg: "Webhook processing failed" });
//   }
// });

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {

    const webhookSignature = req.headers["x-razorpay-signature"];

    const isValid = validateWebhookSignature(
      req.body.toString(),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.log("❌ Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    const body = JSON.parse(req.body.toString());

    console.log("Event:", body.event);

    const paymentDetails = body.payload.payment.entity;

    console.log("Webhook Order ID:", paymentDetails.order_id);

    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });

    console.log("DB Payment:", payment);

    if (!payment) {
      console.log("❌ Payment not found in DB");
      return res.status(404).send("Payment not found");
    }

    payment.status = paymentDetails.status;
    await payment.save();

    console.log("✅ Payment updated to:", payment.status);

    return res.status(200).send("OK");

  } catch (err) {
    console.log("Webhook error:", err);
    return res.status(500).send("Error");
  }
});
module.exports = paymentRouter;
