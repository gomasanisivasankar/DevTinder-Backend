const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
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
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter a strong password"+value)
            }
        
        }
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
        default:"https://www.freepik.com/free-vector/user-circles-set_145856997.htm#fromView=keyword&page=1&position=0&uuid=9d2ecb5e-eeac-4b51-9ba7-d50beae54fd2&query=Default+user",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not valid")
            }
        },
        
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
userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"DEV@Tinder$7901",{expiresIn:'7h'});
    return token;
}
userSchema.methods.ValidatePassword=async function(password){
    const user=this;
    const isPasswordValid = await bcrypt.compare(password,user.password);
    
    return isPasswordValid;
}
module.exports=mongoose.model("User",userSchema)

