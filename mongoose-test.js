const mongoose = require("mongoose");
require("dotenv").config();

async function test() {
    try {
        console.log("🔄 Testing Mongoose...");

        const connection = await mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000
            }
        );

        console.log(
            "✅ Mongoose connected:",
            connection.connection.host
        );

    } catch (error) {

        console.error("❌ Mongoose test failed");
        console.error(error);

    } finally {

        await mongoose.disconnect();

        console.log("🔌 Mongoose disconnected");

    }
}

test();