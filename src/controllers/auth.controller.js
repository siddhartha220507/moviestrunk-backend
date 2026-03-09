const userModel = require('../models/user.model')
  const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function registerController(req, res) {
   try {
        const { email, username, password, bio, profileImage } = req.body

        const isUserAlreadyExists = await userModel.findOne({
            $or: [
               { username },
                { email }
            ]
        })

       if (isUserAlreadyExists) {
            return res.status(409)
                .json({
                    message: "User already exists " + (isUserAlreadyExists.email == email ? "Email already exists" : "Username already exists")
                })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
           email,
            bio,
            profileImage,
            password: hash
        })

        const token = jwt.sign(
            {
               id: user._id
            },
            process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'secret',
            { expiresIn: "1d" }
        )

       const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
           maxAge: 24 * 60 * 60 * 1000 
        };

        res.cookie("token", token, cookieOptions)

        res.status(201).json({
           message: "User Registered successfully",
            token: token,
            user: {
                id: user._id,
                email: user.email,
               username: user.username,
                role: user.role
            }
        })
    } catch (error) {
       console.error("Register Error: ", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function loginController(req, res) {
    try {
       const { username, email, password } = req.body

        if (!username && !email) {
            return res.status(400).json({ message: "Please provide either username or email." });
        }

        const query = [];
       if (username) query.push({ username });
        if (email) query.push({ email });

        const user = await userModel.findOne({ $or: query })

        if (!user) {
           return res.status(404).json({
                message: "User not found"
            })
        }

       const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
               message: "password invalid"
            })
        }

        const token = jwt.sign(
           { id: user._id },
            process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'secret',
            { expiresIn: "1d" }
        )

        const cookieOptions = {
            httpOnly: true,
           secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 
        };

       res.cookie("token", token, cookieOptions)


        res.status(200)
            .json({
               message: "User loggedIn successfully.",
                token: token,
                user: {
                    id: user._id,
                    username: user.username,
                   email: user.email,
                    role: user.role
                }
            })
    } catch (error) {
        console.error("Login Error: ", error);
       res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

async function logoutController(req, res) {
    res.clearCookie("token", {
       httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
   res.status(200).json({
        message: "User logged out successfully"
    });
}

module.exports = {
   registerController,
    loginController,
    logoutController
}