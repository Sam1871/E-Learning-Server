import express from "express";
import {registration, verifyUser, loginUser, myProfile, forgotPassword, resetPassword} from "../controllers/user.controller.js"
import {isauth} from "../middleware/auth.js"
const Router = express.Router()

Router.post("/user/register", registration)
Router.post("/user/verify", verifyUser)
Router.post("/user/loginUser", loginUser)
Router.get("/user/me", isauth, myProfile)
Router.post("/user/forgot", forgotPassword)
Router.post("/user/reset", resetPassword)


export default Router

