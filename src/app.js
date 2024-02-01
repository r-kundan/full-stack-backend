import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded())  //ye url se data lene me kaam aata h jo url me space aata h use fill krta h 

app.use(express.static("public"))
app.use(cookieParser())

//routes import

import userRouter from  "../src/routes/user.router.js"

// router declaration

app.use("/api/v1/users",userRouter)

export default app