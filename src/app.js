require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validations");
const User = require("./models/user");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(404).send("Invalid Credentials ");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {

      const token =await jwt.sign({_id:user._id},"DEV@Tinder$7901",{expiresIn:"1d"});
      res.cookie("token",token,{expires: new Date(Date.now() + 8 * 3600000)});
      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials ");
    }
  } catch (err) {
    res.status(500).send("something went wrong: " + err.message);
  }
});

app.get("/profile",userAuth,async(req,res)=>{
  try
  { 
    const user=req.user; 
    res.send(user);
  }catch (err) {
    res.status(400).send("something went wrong" + err.message);
  }
})

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
  const user=req.user;
  console.log("Sending a connection request");
  res.send(user.firstName+"  send the connection request");
})


connectDB()
  .then(async () => {
    await User.syncIndexes();
    console.log("Database is successfully established");
    app.listen(3000, () => {
      console.log("server is successfully listening on the port 3000");
    });
  })
  .catch((err) => {
    console.log("Database is not connected");
    console.error(err);
  });
