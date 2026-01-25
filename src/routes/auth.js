const express=require('express');
const authRouter=express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validations");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("data added successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("Invalid Credentials ");
    }
    const isPasswordMatch = await user.ValidatePassword(password);
    if (isPasswordMatch) {

      const token =await user.getJWT();
      res.cookie("token",token,{expires: new Date(Date.now() + 8 * 3600000)});
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials ");
    }
  } catch (err) {
    res.status(500).send("something went wrong: " + err.message);
  }
});

authRouter.post("/logout",(req, res) => {
    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logout Successful!!");
})

module.exports=authRouter;
