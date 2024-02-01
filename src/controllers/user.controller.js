import { asyncHandler } from "../utiliti/asyncHandler.js"
import { ApiError } from "../utiliti/apiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utiliti/cloudinary.js"
import { ApiResponse } from "../utiliti/apiRespose.js"

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
    const { fullName, email, userName, password } = req.body
    console.log("email", email);

    //validation : not empy feild------------------------------------

    //     if(fullName === ""){  //begnair level code
    // throw new ApiError(400,"fullname is required")
    //     }
    if (
        [fullName, email, userName, password].some((fieldName) => fieldName?.trim() === "")

    ) {
        throw new ApiError(400, "fullname is required")
    }
    //check if user already exists: username , email--------------------
    
    const existedUser= User.findOne({
        //use oprator to check one is exists: username or email 
        $or:[{ userName },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"user email or userName already exists")
    }
     //check for the image /avatar----------- ------  --  -- -- -- - 
     //yha humne avatar naam  esliye use kiya h kiyo ki user.router.js me humne ese avatar naam diya h
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
//check avatar is exists
if(!avatarLocalPath){
    throw new ApiError(400,"avatar is required")
}
 //upload them to coloudinary ---- ---- ---- -- --- --
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary (coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"avatar is required")
}

    //create user object - entry in db ----- - --- ----  ---  -- - - 
const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName:userName.toLowerCase()
    })
    //remove password and refersh token field from response

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check for user creation ---- -- ------  ------ ---- --  
if(!createdUser){
    throw new ApiError(500,"something went wrong while registering user")
}
    //return response---- -- - - -- -- - -- - -- - - - -- -  -----
return res.status(201).json(
    new ApiResponse(200,createdUser,"User regisered successfully")
)
})

export { registerUser }