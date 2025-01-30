import express from "express"
import {isauth} from "../middleware/auth.js"
import {
    getAllCourses, 
    getSingleCourse, 
    getAllLectures, 
    getSinglelecture,
    getMyCourse, 
    checkout, 
    paymentverifiacttion,
    customPaymentVerification,
    } from "../controllers/course.controller.js"

const router = express.Router()

router.get("/course/all", getAllCourses)
router.get("/course/:id", isauth , getSingleCourse)
router.get("/lectures/:id", isauth , getAllLectures)
router.get("/lecture/:id", isauth , getSinglelecture)
router.get("/mycourse", isauth , getMyCourse)
router.post("/coourse/checkout/:id", isauth, checkout)
router.post("paymentverification/:id", isauth, paymentverifiacttion)
router.post("/addCourse", isauth, customPaymentVerification)

export default router;