require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("./utils/validations");
const User = require("./models/user");
const connectDB = require("./config/database");
const app = express();
app.use(express.json())


app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const {firstName, lastName, emailId, password} = req.body;

    const passwordHash=await bcrypt.hash(password,10)
     const user = new User({
      firstName,
      lastName,
      emailId,
      password:passwordHash
    });

    await user.save();
    res.send("data added successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

app.post("/login", async(req,res)=>{
  const {emailId,password}=req.body;
  try{
    const user=await User.findOne({emailId:emailId})
    if(!user){
       res.status(404).send("Invalid Credentials ")
    }
    const isPasswordMatch=await bcrypt.compare(password,user.password)
    if(isPasswordMatch){
      res.send("Login Successful")
    }
    else{
      throw new Error("Invalid Credentials ")          
  }}
  catch(err){
    res.status(500).send("something went wrong: "+err.message)
  }
})

app.get("/user", async(req,res)=>{
  const userEmail=req.body.emailId;

  try{
    const users=await User.find({emailId:userEmail})
   if(users.length===0){
    res.status(404).send("User Not Found")
   }
   else{
     res.send(users)
   }
  }
  catch(err){
    res.status(400).send("something went wrong"+err.message)
  }
})

app.delete("/user", async(req,res)=>{
  const userId=req.body.userId
  try{
    const user=await User.findByIdAndDelete(userId)
    res.send("User Deleted Successfully")
  }catch(err){
    res.status(400).send("something went wrong"+err.message)
  }
})

app.patch("/user/:userId", async(req,res)=>{
  const userId=req.params?.userId;
  const data=req.body;
  try{
    const ALLOWED_UPDATES=["age","photoURL","about","skills","gender"]
    const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))

    if(!isUpdateAllowed){
      return res.status(400).send("Update not allowed")
    }
    if(data?.skills.length>10 ){
      return res.status(400).send("Skills cannot be more than 10")
    }
    const user= await User.findByIdAndUpdate(userId,data,{returnDocument:"after",runValidators:true})
    console.log(user)
    res.send("User updated successfully")
  }
  catch(err){
    res.status(400).send("Update Failed"+err.message)
  }
})


app.get("/feed",async(req,res)=>{
  try{
    const users=await User.find({})
    res.send(users)
  }
  catch(err){
    res.status(400).send("something went wrong"+err.message)
  }
})


connectDB()
  .then(async () => {
    await User.syncIndexes();
    console.log("Database is successfully established");
    app.listen(3000, () => {
      console.log("server is successfully listening on the port 3000");
    });
  })
  .catch(err => {
    console.log("Database is not connected");
    console.error(err);
  });

