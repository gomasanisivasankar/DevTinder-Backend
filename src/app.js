require("dotenv").config();
const express = require("express");

const User = require("./models/user");
const connectDB = require("./config/database");
const app = express();
app.use(express.json())


app.post("/signup", async (req, res) => {

  const user = new User(req.body);
  try {
    await user.save();
    res.send("data added successfully");
  } catch (err) {
    res.status(500).send("Error saving the user" + err.message);
  }
});

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

app.patch("/user", async(req,res)=>{
  const userId=req.body.userId;
  const data=req.body;
  try{
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

