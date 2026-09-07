// ============================================
// SWAY - Comment Controller
// ============================================

const mongoose = require("mongoose");

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");


// ============================================
// CREATE COMMENT
// ============================================

const createComment = async (req, res) => {

    try {

        // ----------------------------------------
        // AUTHENTICATION CHECK
        // ----------------------------------------

        if (!req.user || !req.user._id) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }


        // ----------------------------------------
        // GET POST ID
        // ----------------------------------------

        const postId = req.params.postId;


        // ----------------------------------------
        // VALIDATE POST ID
        // ----------------------------------------

        if (!mongoose.Types.ObjectId.isValid(postId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid post ID"
            });

        }


        // ----------------------------------------
        // GET CONTENT
        // ----------------------------------------

        const { content } = req.body;


        if (!content || !content.trim()) {

            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });

        }


        // ----------------------------------------
        // FIND POST
        // ----------------------------------------

        const post = await Post.findById(postId);


        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }


        // ----------------------------------------
        // FIND LOGGED-IN USER
        // ----------------------------------------

        const user = await User.findById(req.user._id)
            .select("name username avatar");


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User not found"
            });

        }


        // ----------------------------------------
        // CREATE COMMENT
        // ----------------------------------------

        const comment = await Comment.create({

            post: postId,

            author: user._id,

            content: content.trim()

        });


        // ----------------------------------------
        // UPDATE POST COMMENT COUNT
        // ----------------------------------------

        await Post.findByIdAndUpdate(

            postId,

            {
                $inc: {
                    commentsCount: 1
                }
            }

        );


        // ----------------------------------------
        // POPULATE AUTHOR
        // ----------------------------------------

        const populatedComment =
            await Comment.findById(comment._id)
                .populate(
                    "author",
                    "name username avatar"
                );


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(201).json({

            success: true,

            message: "Comment added successfully",

            comment: populatedComment

        });


    } catch (error) {

        console.error(
            "❌ Create comment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Server error while creating comment"

        });

    }

};


// ============================================
// GET COMMENTS
// ============================================

const getComments = async (req, res) => {

    try {

        const postId = req.params.postId;


        // ----------------------------------------
        // VALIDATE POST ID
        // ----------------------------------------

        if (!mongoose.Types.ObjectId.isValid(postId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid post ID"

            });

        }


        // ----------------------------------------
        // CHECK POST
        // ----------------------------------------

        const post =
            await Post.findById(postId);


        if (!post) {

            return res.status(404).json({

                success: false,

                message: "Post not found"

            });

        }


        // ----------------------------------------
        // GET COMMENTS
        // ----------------------------------------

        const comments =
            await Comment.find({

                post: postId

            })
                .populate(
                    "author",
                    "name username avatar"
                )
                .sort({

                    createdAt: 1

                });


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            count: comments.length,

            comments

        });


    } catch (error) {

        console.error(
            "❌ Get comments error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching comments"

        });

    }

};


// ============================================
// DELETE COMMENT
// ============================================

const deleteComment = async (req, res) => {

    try {

        // ----------------------------------------
        // AUTHENTICATION CHECK
        // ----------------------------------------

        if (!req.user || !req.user._id) {

            return res.status(401).json({

                success: false,

                message: "Authentication required"

            });

        }


        const commentId = req.params.id;


        // ----------------------------------------
        // VALIDATE COMMENT ID
        // ----------------------------------------

        if (!mongoose.Types.ObjectId.isValid(commentId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid comment ID"

            });

        }


        // ----------------------------------------
        // FIND COMMENT
        // ----------------------------------------

        const comment =
            await Comment.findById(commentId);


        if (!comment) {

            return res.status(404).json({

                success: false,

                message: "Comment not found"

            });

        }


        // ----------------------------------------
        // CHECK OWNER
        // ----------------------------------------

        if (
            comment.author.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can only delete your own comments"

            });

        }


        // ----------------------------------------
        // DELETE COMMENT
        // ----------------------------------------

        await Comment.findByIdAndDelete(
            commentId
        );


        // ----------------------------------------
        // DECREASE COMMENT COUNT
        // ----------------------------------------

        await Post.findByIdAndUpdate(

            comment.post,

            {
                $inc: {
                    commentsCount: -1
                }
            }

        );


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Comment deleted successfully"

        });


    } catch (error) {

        console.error(
            "❌ Delete comment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while deleting comment"

        });

    }

};


// ============================================
// EXPORT
// ============================================

module.exports = {

    createComment,

    getComments,

    deleteComment

};