// ============================================
// SWAY - Search Routes
// ============================================

const express = require("express");

const router = express.Router();

const {
    searchUsers
} = require("../controllers/searchController");

const {
    protect
} = require("../middleware/authMiddleware");


// ============================================
// SEARCH USERS
// ============================================

router.get(
    "/users",
    protect,
    searchUsers
);


// ============================================
// EXPORT
// ============================================

module.exports = router;