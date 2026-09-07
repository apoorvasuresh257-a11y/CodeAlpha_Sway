// ============================================
// SWAY - Post Routes
// ============================================

const express = require("express");

const {
    createPost,
    getPosts,
    getPostById,
    toggleLike,
    deletePost
} = require("../controllers/postController");

const {
    protect
} = require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const router = express.Router();


// ============================================
// CREATE POST
// ============================================

// Protected: only logged-in users can create posts.
// Supports optional image upload.

router.post(
    "/",
    protect,
    upload.single("image"),
    createPost
);


// ============================================
// GET ALL POSTS
// ============================================

// Public for now.
// We'll decide feed visibility rules later.

router.get(

    "/",

    getPosts

);


// ============================================
// GET SINGLE POST
// ============================================

router.get(

    "/:id",

    getPostById

);


// ============================================
// LIKE / UNLIKE POST
// ============================================

router.post(

    "/:id/like",

    protect,

    toggleLike

);

// ============================================
// DELETE POST
// ============================================

// Protected: only the author can delete their post.

router.delete(

    "/:id",

    protect,

    deletePost

);

// ============================================
// EXPORT
// ============================================

module.exports = router;