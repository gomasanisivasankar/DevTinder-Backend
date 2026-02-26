const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if(!firstName ||!lastName){
    throw new Error("First Name and Last Name are required");
  }

  else if(!validator.isEmail(emailId)){
    throw new Error("Invalid Email ID");
  }

  else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong enough");
  }
  
}
const ValidateEditProfileData=(req)=>{
  const allowedEditFields=["firstName","lastName","age","gender","photoURL","emailId","about","skills","phoneNumber"];
  const isEditAllowed=Object.keys(req.body).every((field)=> allowedEditFields.includes(field));
  return isEditAllowed;
}

module.exports={validateSignUpData,ValidateEditProfileData}