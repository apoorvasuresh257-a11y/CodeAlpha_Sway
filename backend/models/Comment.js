// ============================================
// SWAY - Comment Model
// ============================================

const mongoose = require("mongoose");


// ============================================
// COMMENT SCHEMA
// ============================================

const commentSchema = new mongoose.Schema(

    {

        // ----------------------------------------
        // POST
        // ----------------------------------------

        post: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Post",

            required: true

        },


        // ----------------------------------------
        // AUTHOR
        // ----------------------------------------

        author: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },


        // ----------------------------------------
        // CONTENT
        // ----------------------------------------

        content: {

            type: String,

            required: [
                true,
                "Comment content is required"
            ],

            trim: true,

            maxlength: [
                300,
                "Comment cannot exceed 300 characters"
            ]

        }

    },

    {

        timestamps: true

    }

);


// ============================================
// INDEX
// ============================================

// Makes fetching comments for a post faster.

commentSchema.index({

    post: 1,

    createdAt: -1

});


// ============================================
// EXPORT
// ============================================

module.exports =
    mongoose.model(
        "Comment",
        commentSchema
    );