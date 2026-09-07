// ============================================
// SWAY - Authentication Middleware
// ============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ============================================
// PROTECT ROUTES
// ============================================

const protect = async (req, res, next) => {

    try {

        // ----------------------------------------
        // GET AUTHORIZATION HEADER
        // ----------------------------------------

        const authHeader = req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }


        // ----------------------------------------
        // CHECK BEARER TOKEN
        // ----------------------------------------

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });

        }


        // ----------------------------------------
        // EXTRACT TOKEN
        // ----------------------------------------

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Authentication token missing"
            });

        }


        // ----------------------------------------
        // VERIFY JWT
        // ----------------------------------------

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // ----------------------------------------
        // FIND USER
        // ----------------------------------------

        const user = await User.findById(
            decoded.userId
        );


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });

        }


        // ----------------------------------------
        // ATTACH USER TO REQUEST
        // ----------------------------------------

        req.user = user;


        // ----------------------------------------
        // CONTINUE
        // ----------------------------------------

        next();

    } catch (error) {

        console.error(
            "❌ Authentication error:",
            error.message
        );


        if (
            error.name === "JsonWebTokenError"
        ) {

            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });

        }


        if (
            error.name === "TokenExpiredError"
        ) {

            return res.status(401).json({
                success: false,
                message: "Authentication token expired"
            });

        }


        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        });

    }

};


// ============================================
// EXPORT
// ============================================

module.exports = {
    protect
};