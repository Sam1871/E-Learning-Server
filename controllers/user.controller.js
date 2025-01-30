import { User } from "../modals/user.modal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendmail from "../middleware/sendmail.js";
import CircularJSON from "circular-json"

export const registration = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash the password
        const hashpassword = await bcrypt.hash(password, 10);

        // Create the user object
        user = {
            username,
            email,
            password: hashpassword,
        };

        // Generate a random OTP
        const Otp = Math.floor(Math.random() * 1000000);
        
        

        // Create an activation token with the user details and OTP
        const activation_token = jwt.sign(
            { user, Otp },
            process.env.Activation_SecretKey,
            { expiresIn: "5m" }
        );

        // Prepare the data for the email
        const data = { username, Otp };

        // Send the verification email
        await sendmail(email, "E-Learning Verification Code", data);

        // Respond with success message and the activation token
        return res.status(200).json({
            message: "OTP sent to your email ID.",
            activation_token,
        });

    } catch (error) {
        // Handle any errors
        return res.status(500).json({
            message: error.message,
        });
    }
};



export const verifyUser = async(req, res) =>{
    try {
        const {Otp, activation_token} = req.body;

        const verify = jwt.verify(activation_token, process.env.Activation_SecretKey)

        if(!verify){
            return res.status(400).json({
                message: "Tokken Expired"
            })
        }


        if (verify.Otp !== Otp) {
            return res.status(400).json({
                message: "Wrong OTP"
            });
        }

        await User.create({
            username :verify.user.username,
            email: verify.user.email,
            password: verify.user.password
    })

        res.json({
            message: "User created Sucessfully"

        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const loginUser = async(req, res) =>{
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user) return res.status(400).json({
            message:"Invalid username and password"
        })

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) return res.status(400).json({
            message:"Invalid username and password"
        })

        const token = jwt.sign({_id: user._id}, process.env.login_sec,{expiresIn:"2d"})

        res.json({
            message: "user login sucessfully",
            user,
            token
        })


        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const myProfile = async(req, res) =>{
    const user = await User.findById(req.user._id);

   res.json({user})
}

