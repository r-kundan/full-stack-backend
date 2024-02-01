import { asyncHandler } from "../utiliti/asyncHandler.js"

const registerUser =asyncHandler(async (req ,res)=>{
    res.status(200).json({
        message: "ok   hi  mera  cocde nhi chla"
    })
})

export {registerUser}