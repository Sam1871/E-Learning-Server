import express from "express"
import {createCourse} from "../controllers/admin.controller.js"
import {isAdmin,isauth} from "../middleware/auth.js"
import {uploadFiles} from "../middleware/multer.js"
import {createLecture , deleteLecture , deleteCourse, getAllstats, allUsers, updateRoles} from "../controllers/admin.controller.js"

const router = express.Router();

router.post("/course/new" ,isauth, isAdmin , uploadFiles.single("files"), createCourse);
router.post("/course/:id" ,isauth, isAdmin , uploadFiles.single("files"), createLecture);
router.delete("/lecture/:id" ,isauth, isAdmin , deleteLecture);
router.delete("/course/:id" ,isauth, isAdmin , deleteCourse);
router.get("/stats", isauth, isAdmin, getAllstats);
router.get("/users", isauth, isAdmin, allUsers);
router.put("/user/:id", isauth, isAdmin, updateRoles );


export default router;