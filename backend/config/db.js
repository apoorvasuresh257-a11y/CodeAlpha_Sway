// ============================================
// SWAY - MongoDB Database Connection
// ============================================

const mongoose = require("mongoose");

const connectDB = async () => {

    try {

        const connection = await mongoose.connect(
    process.env.MONGO_URI,
    {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000
    }
);
        console.log(
            `🗄️ MongoDB connected: ${connection.connection.host}`
        );

    } catch (error) {

        console.error(
            "❌ MongoDB connection failed:",
            error.message
        );

        process.exit(1);
    }
};


module.exports = connectDB;