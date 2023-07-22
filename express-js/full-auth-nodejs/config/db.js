const mongoose = require('mongoose');

// Let's connect DB

const connectDB = async () => {
    const connection = await mongoose.connect("mongodb+srv://admin:qmqhABspEXeZxeTe@cluster0.smftdru.mongodb.net/test", {
        
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
};

module.exports = connectDB;