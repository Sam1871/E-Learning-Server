import {Course} from "../modals/course.modal.js";
import {Lecture} from "../modals/lecture.modal.js"
import {User} from "../modals/user.modal.js"
import {instance} from "../index.js"
import {Razorpay} from "../modals/razorpay.modal.js"
import crypto from "crypto"

export const getAllCourses = async(req, res) =>{
    try {
        const course  = await Course.find()

        res.status(201).json({
            message:`Course fetched sucessfully`,
            course
        })
        
    } catch (error) {
        console.log(`Error occur while fetching the courses: ${error}`)
    }
}

export const getAllLectures =  async(req, res) =>{
    try {
        const lectures = await Lecture.find({course: req.params.id})

        const user = await User.findById(req.user._id)

        if(!user) {
            return res.status(404).json(`User not found`)
        } 

        if(user.role === "admin") {
            return res.status(200).json(lectures)
        }

        if(!user.subscription.includes(req.params.id)) {
            return res.status( 403).json({
                message: "Access denied. You are not subscribed to this course."
            })
        }

        res.status(200).json(lectures)

    } catch (error) {
        console.log(`Error occur while fetching the lectures: ${error}`)
    }
}


export const getSingleCourse = async(req, res) =>{
    try {
        const singleCourse = await Course.findById(req.params.id)

        res.status(200).json({
            singleCourse
        })
    } catch (error) {
        console.log(`Error occur while fetching the single course: ${error}`)
    }
}

export const getSinglelecture = async(req, res) =>{
    try {
        const lecture = await Lecture.findById(req.params.id);
    
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(200).json({ lecture });
        }

    
    if (!user.subscription.includes(lecture.course)) {
      return res.status(403).json({
        message: "Access denied. You are not subscribed to this course.",
      });
    }

    return res.status(200).json({ lecture });

    } catch (error) {
        console.log(`Error occur while fetching the lecture: ${error}`)
    }
}

export const getMyCourse = async(req, res) =>{
    try {
        const mycourse = await Course.find({_id: req.user.subscription})
        
        res.status(200).json(
            mycourse,
        )

    } catch (error) {
        console.log(`Error occur while fetching the my Course: ${error}`)
    }
}
 
export const checkout = async( req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const course = await Course.findById(req.params.id);

        if(user.subscription.includes(course._id))
            return res.status(400).json({
                message: "You already subscribed this coures"
        })

        const options = {
            payment : Number(course.price * 100),
            currency: "INR"
        };

        const order = await instance.orders.create(options)

        res.status(200).json({
            order,
            course,
        })

    } catch (error) {
        console.log(`Error occur while checkout the Course: ${error}`)
    }
}

export const paymentverifiacttion = async( req, res) =>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
        .createHmac("sha256", process.env.Razorpay_Screct)
        .update(body)
        .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if(isAuthentic){
            await Razorpay.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
        });

        const user = await User.findById(req.user._id);

        const course = await Course.findById(req.params.id);

        user.subscription.push(course._id);

        await user.save();

        res.status(200).json({
            message: "Course purchased sucessfully"
        })
        }else{
            return res.status(400).json({
                message: "Payment failed"
            })
        }

        
    } catch (error) {
        console.log(`Error occur while paymentverification of the Course: ${error}`)
    }
} 

export const customPaymentVerification = async (req, res) => {
    try {
      const { userId, courseId } = req.body;
  
      const user = await User.findById(userId);
      const course = await Course.findById(courseId);
  
     
      if (!user.subscription.includes(course._id.toString())) {
        user.subscription.push(course._id);
        res.status(200).json({
            message: "Course purchased successfully",
          });
      }else{
        res.status(400).json({
            message:"course alredy exixt"
      })}
      
      await user.save();
  
      
    } catch (error) {
      console.error(`Error occurred during payment verification: ${error}`);
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  