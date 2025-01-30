import express from 'express'
import dotenv from 'dotenv'
import {connectDb} from './database/db.js'
import Razorpay from "razorpay"
import cors from "cors"

dotenv.config()

export const instance = new Razorpay({
    key_id: 'YOUR_KEY_ID',
    key_secret: 'YOUR_KEY_SECRET',
  });

const app = express()
app.use(cors())

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
    connectDb()
})

app.use(express.json())
app.use("/tmp/my-uploada", express.static("tmp/my-uploada"))

// importing routees
import userRouter from './routes/user.router.js'
import CourseRouter  from './routes/course.router.js'
import AdminRouter from "./routes/admin.router.js"



// defineing routes
app.use("/api/v1" , userRouter )
app.use("/api/v1" , CourseRouter )
app.use("/api/v1" , AdminRouter )



