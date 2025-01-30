import mongoose from "mongoose";

const razorppayschema = new mongoose.Schema({
    razorpay_order_id:{
        type: String,
        required: true,
    },

    razorpay_payment_id:{
        type: String,
        required: true,
    },

    razorpay_signature:{
        type: String,
        required: true,
    },

    createdAt:{
        type: Date,
        default: Date.now
    }

})

export const Razorpay = mongoose.model("Razorpay", razorppayschema)