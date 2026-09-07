// ============================================
// SWAY - Post Model
// ============================================

const mongoose = require("mongoose");


// ============================================
// POST SCHEMA
// ============================================

const postSchema = new mongoose.Schema(

    {

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

    required: false,

    trim: true,

    maxlength: [
        500,
        "Post cannot exceed 500 characters"
    ],

    default: ""

},


        // ----------------------------------------
        // IMAGE
        // ----------------------------------------

        image: {

            type: String,

            default: ""

        },


        // ----------------------------------------
        // LIKES
        // ----------------------------------------

        likes: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            }

        ],


        // ----------------------------------------
        // COMMENTS COUNT
        // ----------------------------------------

        commentsCount: {

            type: Number,

            default: 0,

            min: 0

        }

    },

    {

        timestamps: true

    }

);


// ============================================
// INDEXES
// ============================================

// Feed queries are sorted newest-first.

postSchema.index({
    createdAt: -1
});


// ============================================
// EXPORT MODEL
// ============================================

module.exports =
    mongoose.model("Post", postSchema);