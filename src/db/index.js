import mongoose from "mongoose";
import { DB_NAME } from "../constant.js"

const connectDB = async()=>{
    try {
        const connectionInstance =
        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log(`\n Mongo DB connect !! DB Host:  ${ connectionInstance.connection.host}`)
    } catch (error) {
        console.log("mongoose connection error",error)
        process.exit(1)  //this is node var read this on npm
    }
}

export default connectDB