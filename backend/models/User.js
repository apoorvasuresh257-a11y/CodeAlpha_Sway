// ============================================
// SWAY - User Model
// ============================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// ============================================
// USER SCHEMA
// ============================================

const userSchema = new mongoose.Schema(
    {
        // ----------------------------------------
        // BASIC INFORMATION
        // ----------------------------------------

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 30
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true
        },


        // ----------------------------------------
        // AUTHENTICATION
        // ----------------------------------------

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false
        },


        // ----------------------------------------
        // PROFILE
        // ----------------------------------------

        avatar: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: "",
            maxlength: 160,
            trim: true
        },


        // ----------------------------------------
        // SOCIAL CONNECTIONS
        // ----------------------------------------

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },

    {
        timestamps: true
    }
);

// ============================================
// PASSWORD HASHING
// ============================================

userSchema.pre("save", async function (next) {

    // Password hasn't changed
    if (!this.isModified("password")) {
        return next();
    }

    // Generate secure password hash
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );

    next();
});

// ============================================
// EXPORT MODEL
// ============================================

const User = mongoose.model("User", userSchema);

module.exports = User;