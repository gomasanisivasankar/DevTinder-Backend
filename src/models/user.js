const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        unique: true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        
    },
    age:{
        type:Number,
        min:18,
        
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
             throw new Error("Gender data is  not valid")
            }
        }
    },
    photoURL:{
        type:String,
        default:"",
    },
    about:{
        type:String,
        default:"This is all about of the User!"
    },
    skills:{
        type:[String]
    }

},
{ timestamps: true }
)

module.exports=mongoose.model("User",userSchema)

