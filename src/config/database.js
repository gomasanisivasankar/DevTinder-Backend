const mongoose=require('mongoose')

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://sivasankar:DPZll5Rqxk1gJeJ4@namastedev.6ulpizu.mongodb.net/devTinder")

}
module.exports=connectDB;
