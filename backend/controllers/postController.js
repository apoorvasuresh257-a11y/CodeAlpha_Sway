// ============================================
// SWAY - Post Controller
// ============================================

const mongoose = require("mongoose");

const Post = require("../models/Post");


// ============================================
// CREATE POST
// ============================================

const createPost = async (req, res) => {

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
        // GET CONTENT
        // ----------------------------------------

        const content =
            req.body.content
                ? req.body.content.trim()
                : "";


        // ----------------------------------------
        // GET IMAGE
        // ----------------------------------------

        const image =
            req.file
                ? `/uploads/${req.file.filename}`
                : "";


        // ----------------------------------------
        // VALIDATE POST
        // ----------------------------------------
        // A post must contain either:
        // 1. Text
        // OR
        // 2. Image

        if (!content && !image) {

            return res.status(400).json({

                success: false,

                message:
                    "Post must contain text or an image"

            });

        }


        // ----------------------------------------
        // CREATE POST
        // ----------------------------------------

        const post = await Post.create({

            author: req.user._id,

            content: content,

            image: image

        });


        // ----------------------------------------
        // POPULATE AUTHOR
        // ----------------------------------------

        const populatedPost =
            await Post.findById(post._id)
                .populate(
                    "author",
                    "name username avatar"
                );


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(201).json({

            success: true,

            message: "Post created successfully",

            post: populatedPost

        });

    } catch (error) {

        console.error(
            "❌ Create post error:",
            error
        );


        // ----------------------------------------
        // MULTER FILE ERROR
        // ----------------------------------------

        if (error.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({

                success: false,

                message:
                    "Image size cannot exceed 5 MB"

            });

        }


        // ----------------------------------------
        // MONGOOSE VALIDATION ERROR
        // ----------------------------------------

        if (error.name === "ValidationError") {

            const messages =
                Object.values(error.errors)
                    .map(
                        err => err.message
                    );


            return res.status(400).json({

                success: false,

                message:
                    messages.join(", ")

            });

        }


        // ----------------------------------------
        // SERVER ERROR
        // ----------------------------------------

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating post"

        });

    }

};


// ============================================
// GET ALL POSTS
// ============================================

const getPosts = async (req, res) => {

    try {

        console.time("GET /api/posts");


        // ----------------------------------------
        // FETCH POSTS
        // ----------------------------------------

        const posts =
            await Post.find()
                .populate(
                    "author",
                    "name username avatar"
                )
                .sort({
                    createdAt: -1
                });


        console.log(
            `📦 Posts fetched: ${posts.length}`
        );


        console.timeEnd("GET /api/posts");


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            count: posts.length,

            posts

        });

    } catch (error) {

        console.error(
            "❌ Get posts error:",
            error
        );


        console.timeEnd("GET /api/posts");


        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching posts"

        });

    }

};


// ============================================
// GET SINGLE POST
// ============================================

const getPostById = async (req, res) => {

    try {

        // ----------------------------------------
        // VALIDATE POST ID
        // ----------------------------------------

        const postId = req.params.id;


        if (!mongoose.Types.ObjectId.isValid(postId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid post ID"

            });

        }


        // ----------------------------------------
        // FIND POST
        // ----------------------------------------

        const post =
            await Post.findById(postId)
                .populate(
                    "author",
                    "name username avatar"
                );


        // ----------------------------------------
        // POST NOT FOUND
        // ----------------------------------------

        if (!post) {

            return res.status(404).json({

                success: false,

                message: "Post not found"

            });

        }


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            post

        });

    } catch (error) {

        console.error(
            "❌ Get post error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching post"

        });

    }

};


// ============================================
// TOGGLE LIKE
// ============================================

const toggleLike = async (req, res) => {

    try {

        if (!req.user || !req.user._id) {

            return res.status(401).json({

                success: false,

                message: "Authentication required"

            });

        }


        const postId = req.params.id;


        if (!mongoose.Types.ObjectId.isValid(postId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid post ID"

            });

        }


        const userId = req.user._id;


        // Find current post

        const post =
            await Post.findById(postId);


        if (!post) {

            return res.status(404).json({

                success: false,

                message: "Post not found"

            });

        }


        // Make sure likes exists

        const likes =
            Array.isArray(post.likes)
                ? post.likes
                : [];


        // Check current state

        const alreadyLiked =
            likes.some(
                id =>
                    id.toString() ===
                    userId.toString()
            );


        // ========================================
        // UNLIKE
        // ========================================

        if (alreadyLiked) {

            const updatedPost =
                await Post.findByIdAndUpdate(

                    postId,

                    {
                        $pull: {
                            likes: userId
                        }
                    },

                    {
                        new: true
                    }

                );


            return res.status(200).json({

                success: true,

                liked: false,

                likesCount:
                    updatedPost.likes.length,

                postId:
                    updatedPost._id

            });

        }


        // ========================================
        // LIKE
        // ========================================

        const updatedPost =
            await Post.findByIdAndUpdate(

                postId,

                {
                    $addToSet: {
                        likes: userId
                    }
                },

                {
                    new: true
                }

            );


        return res.status(200).json({

            success: true,

            liked: true,

            likesCount:
                updatedPost.likes.length,

            postId:
                updatedPost._id

        });

    } catch (error) {

        console.error(
            "❌ Toggle like error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while liking post"

        });

    }

};

// ============================================
// DELETE POST
// ============================================

const deletePost = async (req, res) => {

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

        const postId = req.params.id;


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
        // FIND POST
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
        // CHECK POST OWNER
        // ----------------------------------------

        if (
            post.author.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can only delete your own posts"

            });

        }


        // ----------------------------------------
        // DELETE POST
        // ----------------------------------------

        await Post.findByIdAndDelete(
            postId
        );


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Post deleted successfully",

            postId

        });


    } catch (error) {

        console.error(
            "❌ Delete post error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while deleting post"

        });

    }

};
// ============================================
// EXPORT
// ============================================

module.exports = {

    createPost,

    getPosts,

    getPostById,

    toggleLike,

    deletePost

};