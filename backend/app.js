// ============================================
// SWAY - Express Application
// ============================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();


// ============================================
// SECURITY & MIDDLEWARE
// ============================================

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ============================================
// STATIC UPLOADED FILES
// ============================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {

    res.status(200).json({

        success: true,

        message: "Sway API is running 🚀"

    });

});


// ============================================
// AUTHENTICATION ROUTES
// ============================================

app.use(
    "/api/auth",
    authRoutes
);


// ============================================
// POST ROUTES
// ============================================

app.use(
    "/api/posts",
    postRoutes
);


// ============================================
// COMMENT ROUTES
// ============================================

app.use(
    "/api/comments",
    commentRoutes
);

// ============================================
// USER / PROFILE ROUTES
// ============================================

app.use(
    "/api/users",
    userRoutes
);

// ============================================
// SEARCH ROUTES
// ============================================

app.use(
    "/api/search",
    searchRoutes
);

// ============================================
// 404 NOT FOUND
// ============================================

app.use(notFound);


// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorHandler);


// ============================================
// EXPORT APP
// ============================================

module.exports = app;