const express=require("express")
const app=express()

app.use("/user",(req,res,next)=>{
    console.log("Handling first route!!")
   
    next()
    //  res.send("first Response")
},(req,res)=>{
    console.log("Handling second route")
    // res.send("second route")
    next()
})

app.listen(3000,()=>{
    console.log("server is successfully listening on the port 3000")
})