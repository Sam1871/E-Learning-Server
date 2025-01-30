import mongoose from "mongoose";

export const connectDb = async () =>{
    try {
         await mongoose.connect(process.env.DB);
       console.log("Database is connected !!")
   } catch (error) {
       console.log(`Database connection error:${error}`)
   }
}