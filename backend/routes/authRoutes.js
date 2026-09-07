// ============================================
// SWAY - Authentication Routes
// ============================================

const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController.js");
const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ============================================
// REGISTER
// ============================================

router.post(
    "/register",
    registerUser
);

// ============================================
// CURRENT USER - PROTECTED TEST ROUTE
// ============================================

router.get(
    "/me",
    protect,
    (req, res) => {

        res.status(200).json({

            success: true,

            user: {
                id: req.user._id,
                name: req.user.name,
                username: req.user.username,
                email: req.user.email,
                avatar: req.user.avatar,
                bio: req.user.bio
            }

        });

    }
);

module.exports = router;
// ============================================
// LOGIN
// ============================================

router.post(
    "/login",
    loginUser
);