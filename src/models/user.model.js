import mongoose, { Schema } from "mongoose"
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const userSchema = new Schema({
userName : {
    type: String,
    trim: true,
    required:true,
    unique: true,
    lowercase: true,
    index:true
},
email : {
    type: String,
    trim: true,
    required:true,
    unique: true,
    lowercase: true,
 
},
fullName : {
    type: String,
    trim: true,
    required:true,
    index:true
},
avatar: {
    type: String, //cloudinary url
    required:true,
},
coverImage: {
    type: String, //cloudinary url
},
watchhistory:[
    {
        type : Schema.Types.ObjectId,
        ref: "Video"
    }
],
password:{
    type:String,
    trim: true,
    required: [true,'password is required'],
    minLenght:8,
},
refreshToken:{
    type: String
},

},
{
    timestamps:true,
}
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password= bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
return await bcrypt.compare(password ,this.password) // ye return me boolean value  dega
}
userSchema.methods.generateAccessToken = async function (){
   //ye niche wala part payload h 
   return jwt.sign(
        {
    // payload name : database name ye database se lege hum
            _id : this._id,
            userName: this.userName,
            fullName: this.fullName,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = async function (){
     //ye niche wala part payload h 
   return jwt.sign(
    {
// payload name : database name ye database se lege hum
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
)
}


export const User = mongoose.model( "User",userSchema)