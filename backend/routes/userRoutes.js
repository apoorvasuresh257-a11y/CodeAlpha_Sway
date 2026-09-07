// ============================================
// SWAY - User Routes
// ============================================

const express = require("express");

const router = express.Router();


// ============================================
// CONTROLLER
// ============================================

const {
    getMyProfile,
    getUserProfile,
    getUserPosts,
    toggleFollow,
    updateMyProfile
} = require("../controllers/userController");


// ============================================
// AUTH MIDDLEWARE
// ============================================

const {
    protect
} = require("../middleware/authMiddleware");


// ============================================
// MY PROFILE
// ============================================

router.get(
    "/profile/me",
    protect,
    getMyProfile
);

// ============================================
// UPDATE MY PROFILE
// ============================================

router.put(
    "/profile/me",
    protect,
    updateMyProfile
);

// ============================================
// USER PROFILE
// ============================================

router.get(
    "/:id",
    protect,
    getUserProfile
);


// ============================================
// USER POSTS
// ============================================

router.get(
    "/:id/posts",
    protect,
    getUserPosts
);


// ============================================
// FOLLOW / UNFOLLOW
// ============================================

router.post(
    "/:id/follow",
    protect,
    toggleFollow
);


// ============================================
// EXPORT
// ============================================

module.exports = router;