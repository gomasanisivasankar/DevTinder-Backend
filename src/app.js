const express=require("express")
const app=express()

app.use("/",(req,res)=>{
    res.send("Hello from the Dashboard")
})
app.use("/test",(req,res)=>{
    res.send("Hello from the server")
})
app.listen(3000,()=>{
    console.log("server is successfully listening on the port 3000")
})