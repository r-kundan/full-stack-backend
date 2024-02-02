import { asyncHandler } from "../utiliti/asyncHandler.js"
import { ApiError } from "../utiliti/apiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utiliti/cloudinary.js"
import { ApiResponse } from "../utiliti/apiRespose.js"
// import jwt from "jsonwebtoken"
import mongoose from "mongoose"




const generateAccessAndRefreshTokens = async(userId) =>{
    try {
      //yha ye user ko find kr rha h 
        const user = await User.findById(userId)
 // access and refresh token generate kr rhe h
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    //refresh token save in db
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
//return tokens
        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    //validation : not empy feild
    //check if user already exists: username , email
    //check for the image /avatar
    //upload them to coloudinary 
    //create user object - entry in db
    //remove password and refersh token field from response
    //check for user creation
    //return response

    //start code.......**** ***** **** **** ***** ***** *****


    // get user details from frontend---------------------------------
    const { fullName, email, userName, password } = req.body;
    // console.log("email", email);

    //validation : not empy feild------------------------------------

    //     if(fullName === ""){  //begnair level code
    // throw new ApiError(400,"fullname is required")
    //     }
    if (
        [fullName, email, userName, password].some((field) => field?.trim() === ""))
     {
        throw new ApiError(400, "fullname is required")
    }
    //check if user already exists: username , email--------------------

    const existedUser = await User.findOne({
        //use oprator to check one is exists: username or email 
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user email or userName already exists")
    }
    //check for the image /avatar----------- ------  --  -- -- -- - 
    //yha humne avatar naam  esliye use kiya h kiyo ki user.router.js me humne ese avatar naam diya h
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    //check avatar is exists
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required")
    }
    //upload them to coloudinary ---- ---- ---- -- --- --
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar is required")
    }

    //create user object - entry in db ----- - --- ----  ---  -- - - 
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })
    //remove password and refersh token field from response

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check for user creation ---- -- ------  ------ ---- --  
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }
    //return response---- -- - - -- -- - -- - -- - - - -- -  -----
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User regisered successfully")
    )
})


const loginUser = asyncHandler(async (req,res) => {
    //req body  =   data
    //username or email
    //find user
    //password check
    //access and referesh token
    //send cookies
    const { userName, email, password } = req.body

    if (!(userName  || email)){
        throw new ApiError(404, "userName and email is required")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if(!user){
        throw new ApiError(404,"user not found")
    }

const isPasswordVaild = await user.isPasswordCorrect(password)
    if(!isPasswordVaild){
        throw new ApiError(401,"password is not correct")
    }
    //access and referesh token

  const {refreshToken,accessToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  
  //send cookies
  const options ={
    httpOnly : true,
    secure: true
  }
  return  res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user logged in sucessfully")
  )

})

const logOutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:  undefined
        }
    },
    {
        new: true
    }
    )
    const options ={
        httpOnly : true,
        secure: true
      }
      return  res
      .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,
        {},
        "user logout  sucessfully")
  )

})
    
export { registerUser,loginUser ,logOutUser}
