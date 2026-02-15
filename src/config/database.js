const mongoose=require('mongoose')

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://sivasankar:gC3YQjl8f5kkPnun@namastedev.6ulpizu.mongodb.net/devTinder")

}
module.exports=connectDB;
