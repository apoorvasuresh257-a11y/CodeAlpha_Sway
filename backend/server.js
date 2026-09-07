// ============================================
// SWAY - Server Entry Point
// ============================================

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");


const PORT = process.env.PORT || 5000;

// ============================================
// START SERVER
// ============================================

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Start Express server only after DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Sway server running on port ${PORT}`);
            console.log(`🌐 http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start Sway:", error.message);
        process.exit(1);
    }
};

startServer();