// ============================================
// SWAY - User Controller
// ============================================

const mongoose = require("mongoose");

const User = require("../models/User");
const Post = require("../models/Post");


// ============================================
// GET MY PROFILE
// ============================================

const getMyProfile = async (req, res) => {

    try {

        if (!req.user || !req.user._id) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }

        const user = await User.findById(
            req.user._id
        ).select("-password");

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        return res.status(200).json({

            success: true,

            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                bio: user.bio,

                followersCount:
                    user.followers.length,

                followingCount:
                    user.following.length
            }

        });

    } catch (error) {

        console.error(
            "❌ Get my profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while loading profile"
        });

    }

};


// ============================================
// GET USER PROFILE
// ============================================

const getUserProfile = async (req, res) => {

    try {

        const userId = req.params.id;


        // ----------------------------------------
        // VALIDATE USER ID
        // ----------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(userId)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });

        }


        // ----------------------------------------
        // FIND USER
        // ----------------------------------------

        const user = await User.findById(
            userId
        ).select("-password");


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // ----------------------------------------
        // CHECK FOLLOW STATUS
        // ----------------------------------------

        let isFollowing = false;

        if (req.user && req.user._id) {

            isFollowing =
                user.followers.some(
                    followerId =>
                        followerId.toString() ===
                        req.user._id.toString()
                );

        }


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            user: {

                _id: user._id,

                name: user.name,

                username: user.username,

                avatar: user.avatar,

                bio: user.bio,

                followersCount:
                    user.followers.length,

                followingCount:
                    user.following.length,

                isFollowing

            }

        });

    } catch (error) {

        console.error(
            "❌ Get user profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while loading profile"
        });

    }

};


// ============================================
// GET USER POSTS
// ============================================

const getUserPosts = async (req, res) => {

    try {

        const userId = req.params.id;


        // ----------------------------------------
        // VALIDATE USER ID
        // ----------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(userId)
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });

        }


        // ----------------------------------------
        // CHECK USER
        // ----------------------------------------

        const user = await User.findById(
            userId
        );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // ----------------------------------------
        // GET POSTS
        // ----------------------------------------

        const posts = await Post.find({
            author: userId
        })
            .populate(
                "author",
                "name username avatar"
            )
            .sort({
                createdAt: -1
            });


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
            "❌ Get user posts error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while loading user posts"
        });

    }

};


// ============================================
// TOGGLE FOLLOW
// ============================================

const toggleFollow = async (req, res) => {

    try {

        // ----------------------------------------
        // AUTHENTICATION
        // ----------------------------------------

        if (!req.user || !req.user._id) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }


        const currentUserId =
            req.user._id;

        const targetUserId =
            req.params.id;


        // ----------------------------------------
        // VALIDATE USER ID
        // ----------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                targetUserId
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });

        }


        // ----------------------------------------
        // CANNOT FOLLOW YOURSELF
        // ----------------------------------------

        if (
            currentUserId.toString() ===
            targetUserId.toString()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "You cannot follow yourself"
            });

        }


        // ----------------------------------------
        // FIND TARGET USER
        // ----------------------------------------

        const targetUser =
            await User.findById(
                targetUserId
            );


        if (!targetUser) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // ----------------------------------------
        // FIND CURRENT USER
        // ----------------------------------------

        const currentUser =
            await User.findById(
                currentUserId
            );


        if (!currentUser) {

            return res.status(404).json({
                success: false,
                message:
                    "Current user not found"
            });

        }


        // ----------------------------------------
        // CHECK FOLLOW STATUS
        // ----------------------------------------

        const alreadyFollowing =
            targetUser.followers.some(
                followerId =>
                    followerId.toString() ===
                    currentUserId.toString()
            );


        // ========================================
        // UNFOLLOW
        // ========================================

        if (alreadyFollowing) {

            targetUser.followers.pull(
                currentUserId
            );

            currentUser.following.pull(
                targetUserId
            );

            await targetUser.save();

            await currentUser.save();


            return res.status(200).json({

                success: true,

                following: false,

                followersCount:
                    targetUser.followers.length,

                followingCount:
                    currentUser.following.length,

                message:
                    "User unfollowed successfully"

            });

        }


        // ========================================
        // FOLLOW
        // ========================================

        targetUser.followers.addToSet(
            currentUserId
        );

        currentUser.following.addToSet(
            targetUserId
        );


        await targetUser.save();

        await currentUser.save();


        return res.status(200).json({

            success: true,

            following: true,

            followersCount:
                targetUser.followers.length,

            followingCount:
                currentUser.following.length,

            message:
                "User followed successfully"

        });

    } catch (error) {

        console.error(
            "❌ Toggle follow error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while following user"
        });

    }

};


// ============================================
// UPDATE MY PROFILE
// ============================================

const updateMyProfile = async (req, res) => {

    try {

        // ----------------------------------------
        // AUTHENTICATION
        // ----------------------------------------

        if (!req.user || !req.user._id) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }


        // ----------------------------------------
        // GET INPUT
        // ----------------------------------------

        const {
            name,
            username,
            bio,
            avatar
        } = req.body;


        // ----------------------------------------
        // VALIDATE NAME
        // ----------------------------------------

        if (
            name !== undefined &&
            (
                typeof name !== "string" ||
                name.trim().length < 2 ||
                name.trim().length > 50
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name must be between 2 and 50 characters"
            });

        }


        // ----------------------------------------
        // VALIDATE USERNAME
        // ----------------------------------------

        if (
            username !== undefined &&
            (
                typeof username !== "string" ||
                username.trim().length < 3 ||
                username.trim().length > 30
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Username must be between 3 and 30 characters"
            });

        }


        // ----------------------------------------
        // VALIDATE BIO
        // ----------------------------------------

        if (
            bio !== undefined &&
            (
                typeof bio !== "string" ||
                bio.trim().length > 160
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Bio cannot exceed 160 characters"
            });

        }


        // ----------------------------------------
        // FIND USER
        // ----------------------------------------

        const user =
            await User.findById(
                req.user._id
            );


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // ----------------------------------------
        // UPDATE NAME
        // ----------------------------------------

        if (name !== undefined) {

            user.name =
                name.trim();

        }


        // ----------------------------------------
        // UPDATE USERNAME
        // ----------------------------------------

        if (username !== undefined) {

            const newUsername =
                username
                    .trim()
                    .toLowerCase();


            const existingUser =
                await User.findOne({

                    username: newUsername,

                    _id: {
                        $ne: user._id
                    }

                });


            if (existingUser) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Username is already taken"

                });

            }


            user.username =
                newUsername;

        }


        // ----------------------------------------
        // UPDATE BIO
        // ----------------------------------------

        if (bio !== undefined) {

            user.bio =
                bio.trim();

        }


        // ----------------------------------------
        // UPDATE AVATAR
        // ----------------------------------------

        if (avatar !== undefined) {

            user.avatar =
                avatar;

        }


        // ----------------------------------------
        // SAVE
        // ----------------------------------------

        await user.save();


        // ----------------------------------------
        // RESPONSE
        // ----------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Profile updated successfully",

            user: {

                _id: user._id,

                name: user.name,

                username: user.username,

                avatar: user.avatar,

                bio: user.bio,

                followersCount:
                    user.followers.length,

                followingCount:
                    user.following.length

            }

        });

    } catch (error) {

        console.error(
            "❌ Update profile error:",
            error
        );


        // ----------------------------------------
        // DUPLICATE USERNAME / EMAIL
        // ----------------------------------------

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "Username or email is already in use"

            });

        }


        // ----------------------------------------
        // VALIDATION ERROR
        // ----------------------------------------

        if (
            error.name === "ValidationError"
        ) {

            const messages =
                Object.values(
                    error.errors
                ).map(
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
                "Server error while updating profile"

        });

    }

};


// ============================================
// EXPORT
// ============================================

module.exports = {

    getMyProfile,

    getUserProfile,

    getUserPosts,

    toggleFollow,

    updateMyProfile

};