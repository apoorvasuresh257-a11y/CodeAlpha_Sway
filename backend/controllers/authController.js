// ============================================
// SWAY - Authentication Controller
// ============================================

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ============================================
// REGISTER USER
// ============================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            username,
            email,
            password
        } = req.body;


        // ----------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ----------------------------------------

        if (
            !name ||
            !username ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }


        // ----------------------------------------
        // CLEAN INPUT
        // ----------------------------------------

        const cleanName = name.trim();

        const cleanUsername =
            username.toLowerCase().trim();

        const cleanEmail =
            email.toLowerCase().trim();


        // ----------------------------------------
        // VALIDATE PASSWORD
        // ----------------------------------------

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });

        }


        // ----------------------------------------
        // VALIDATE NAME
        // ----------------------------------------

        if (cleanName.length < 2) {

            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters"
            });

        }


        // ----------------------------------------
        // VALIDATE USERNAME
        // ----------------------------------------

        if (cleanUsername.length < 3) {

            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters"
            });

        }


        // ----------------------------------------
        // CHECK EXISTING USER
        // ----------------------------------------

        const existingUser = await User.findOne({
            $or: [
                {
                    email: cleanEmail
                },
                {
                    username: cleanUsername
                }
            ]
        });


        if (existingUser) {

            if (existingUser.email === cleanEmail) {

                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });

            }


            if (existingUser.username === cleanUsername) {

                return res.status(409).json({
                    success: false,
                    message: "Username already exists"
                });

            }

        }


        // ----------------------------------------
        // CREATE USER
        // ----------------------------------------

        const user = await User.create({

            name: cleanName,

            username: cleanUsername,

            email: cleanEmail,

            password: password

        });


        // ----------------------------------------
        // SAFE RESPONSE
        // ----------------------------------------

        return res.status(201).json({

            success: true,

            message: "Account created successfully",

            user: {

                id: user._id,

                name: user.name,

                username: user.username,

                email: user.email,

                avatar: user.avatar,

                bio: user.bio

            }

        });

    } catch (error) {

        console.error(
            "❌ Register error:",
            error
        );


        // ----------------------------------------
        // MONGOOSE VALIDATION ERROR
        // ----------------------------------------

        if (error.name === "ValidationError") {

            const messages =
                Object.values(error.errors)
                    .map(
                        (err) => err.message
                    );

            return res.status(400).json({

                success: false,

                message: messages.join(", ")

            });

        }


        // ----------------------------------------
        // DUPLICATE KEY ERROR
        // ----------------------------------------

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "Email or username already exists"

            });

        }


        // ----------------------------------------
        // SERVER ERROR
        // ----------------------------------------

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating account"

        });

    }

};


// ============================================
// LOGIN USER
// ============================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ----------------------------------------
        // VALIDATE INPUT
        // ----------------------------------------

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }


        // ----------------------------------------
        // CLEAN EMAIL
        // ----------------------------------------

        const cleanEmail =
            email.toLowerCase().trim();


        // ----------------------------------------
        // FIND USER
        // ----------------------------------------
        // Password uses select:false in User.js,
        // so explicitly include it for login.

        const user = await User.findOne({
            email: cleanEmail
        }).select("+password");


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        // ----------------------------------------
        // COMPARE PASSWORD
        // ----------------------------------------

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        // ----------------------------------------
        // CHECK JWT SECRET
        // ----------------------------------------

        if (!process.env.JWT_SECRET) {

            console.error(
                "❌ JWT_SECRET is missing from .env"
            );

            return res.status(500).json({
                success: false,
                message:
                    "Authentication configuration error"
            });

        }


        // ----------------------------------------
        // CREATE JWT
        // ----------------------------------------

        const token = jwt.sign(

            {
                userId: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // ----------------------------------------
        // SAFE RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            message: "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                username: user.username,

                email: user.email,

                avatar: user.avatar,

                bio: user.bio

            }

        });

    } catch (error) {

        console.error(
            "❌ Login error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while logging in"

        });

    }

};


// ============================================
// EXPORT CONTROLLER
// ============================================

module.exports = {
    registerUser,
    loginUser
};