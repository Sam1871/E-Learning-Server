import jwt from "jsonwebtoken"
import {User} from "../modals/user.modal.js"

export const isauth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({
                message: "Please login"
            });
        }

        const token = authHeader.replace("Bearer ", "").trim();

        if (!token) {
            return res.status(402).json({
                message: "Please login"
            });
        }

        const decodeData = jwt.verify(token, process.env.login_sec);

        const userdata = await User.findById(decodeData._id);
        if (!userdata) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = userdata;
        next();
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const isAdmin = (req, res,next) =>{
    try {
        if(req.user.role !== "admin")
        return res.status(403).json({
    message:"You are not admin"})

    next()
        
    } catch (error) {
        res.status(500).json({
            Message: error.Message
        })
    }
}