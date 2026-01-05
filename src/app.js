const express=require("express")
const app=express()

app.get("/user",(req,res)=>{
    res.send({firstname:"Sivasankar",lastname:"Gomasani"})   
})

app.post("/user",(req,res)=>{
    res.send("sav data into the database")
})
app.delete("/user",(req,res)=>{
    res.send("user data deleted successfully")
})
// This will match all HTTP methods API call to /test
app.use("/test",(req,res)=>{
    res.send("Hello from the server")
})


app.listen(3000,()=>{
    console.log("server is successfully listening on the port 3000")
})