import {Course} from "../modals/course.modal.js"
import {Lecture} from "../modals/lecture.modal.js"
import {rm} from "fs"
import { promisify } from "util"
import fs from "fs"
import { promiseHooks } from "v8"
import {User} from "../modals/user.modal.js"



export const createCourse = async(req, res) =>{
    try {
        const {title, description, price, duration, category, createdBy} = req.body;

        const image = req.file;
        

        const newCourse = await Course.create({
            title,
            description,
            price,
            duration,
            category,
            createdBy,
            image: image.path,
        })

        res.status(200).json({
            message: "Course Created Sucessfully",
            course :newCourse
        });


    } catch (error) {
        res.status(400).json({
            message: error.message
    })
    }
}

export const createLecture = async(req, res) =>{
    try {
        const course = await Course.findById(req.params.id)
        console.log(course)
    
        if(!course){
            return res.status(404).json({
                message:" No course with this ID"
            })
        }
    
        const {title, description} = req.body;
    
        const video = req.file;
    
        const addLecture = await Lecture.create({
            title,
            description,
            video: video?.path,
            course: course._id
        })
    
        res.status(203).json({
            message: "Lecture added sucessfully",
            addLecture,
        })
    } catch (error) {
        res.status(400).json({
            message: `Error while adding lecture: ${error}`
        })
    }
 
}

export const deleteLecture = async(req, res) =>{
    try {
        const lecture = await Lecture.findById(req.params.id)

        rm(lecture.video, ()=>{
            console.log("Video deleted")
        });

        await lecture.deleteOne();

        res.status(200).json({
            message: "Video Deleted"
        });

    } catch (error) {
        console.log(`Error while deleting the lecture: ${error}`)
    }
}


export const deleteCourse = async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const lectures = await Lecture.find({ course: course._id });
        const deleteFile = promisify(fs.unlink);

        // Delete all lecture videos
        await Promise.all(lectures.map(
            async (lecture) => {
                await deleteFile(lecture.video);
                console.log("Video Deleted");
            }
        ));

        // Delete the course image
        await deleteFile(course.image);
        console.log("Image deleted");

        // Delete all lectures associated with the course
        await Lecture.deleteMany({ course: req.params.id });

        // Delete the course
        await course.deleteOne();

        // Update users to remove the course from their subscriptions
        await User.updateMany({}, { $pull: { subscription: req.params.id } });

        res.status(200).json({
            message: "Course deleted successfully"
        });
        
    } catch (error) {
        console.log(`Error while deleting the Course: ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllstats = async (req, res) =>{
    try {
        const totalCourse = (await Course.find()).length;
        const totallecture = (await Lecture.find()).length;
        const totalUsers = (await User.find()).length;

        const stats = {
            totalCourse,
            totallecture,
            totalUsers
        }

        res.status(200).json({
            stats
        })

    } catch (error) {
        console.log(`Error while fetching the stats: ${error}`);
    }
}

export const allUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

        return res.status(200).json({
            message: "Users fetched successfully",
            users,
        });

    } catch (error) {
        console.error(`Error while fetching the users: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateRoles = async(req, res) =>{
    try {
        const user = await User.findById(req.params.id);

        if(user.role === "user"){
            user.role === "admin";
            await user.save();

            return res.stats(200).json({
                message: "User role is updated to Admin"

            })
        }

        if(user.role === "admin"){
            user.role === "user";
            await user.save();

            return res.stats(200).json({
                message: "User role is updated to User"

            })
        }
    } catch (error) {
        console.log(`Error while updatimg the user roles: ${error}`)
    }
}