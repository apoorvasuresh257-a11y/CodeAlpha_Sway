// ============================================
// SWAY - Comment Routes
// ============================================

const express = require("express");

const {

    createComment,

    getComments,

    deleteComment

} = require("../controllers/commentController");

const {

    protect

} = require("../middleware/authMiddleware");


const router = express.Router();


// ============================================
// CREATE COMMENT
// ============================================

router.post(

    "/:postId",

    protect,

    createComment

);


// ============================================
// GET COMMENTS
// ============================================

router.get(

    "/:postId",

    getComments

);


// ============================================
// DELETE COMMENT
// ============================================

router.delete(

    "/:id",

    protect,

    deleteComment

);


// ============================================
// EXPORT
// ============================================

module.exports = router;