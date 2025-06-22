// this file will connect our app to mongoDB database

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error("MongoDB connection error:", err);
    //     make sure to exit the process in case of failure
        process.exit(1);
    }
}

module.exports = connectDB;

// open server.js file