import { Router } from "express"
import { logOutUser, loginUser, registerUser,refereshAccessToken} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
router.route("/register").post(
    //middleware added 
    upload.fields([
        {
            name : "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ])
    ,registerUser)
router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT  , logOutUser)
router.route("/refresh-Token").post(refereshAccessToken)

export default router