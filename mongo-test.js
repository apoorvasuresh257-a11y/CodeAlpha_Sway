const { MongoClient } = require("mongodb");

require("dotenv").config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
});

async function testConnection() {
    try {
        console.log("🔄 Testing MongoDB connection...");

        await client.connect();

        console.log("✅ MongoDB driver connected!");

        await client.db("Sway").command({
            ping: 1
        });

        console.log("🏓 MongoDB ping successful!");

    } catch (error) {

        console.error("❌ MongoDB test failed:");
        console.error(error);

    } finally {

        await client.close();

        console.log("🔌 Test connection closed.");

    }
}

testConnection();