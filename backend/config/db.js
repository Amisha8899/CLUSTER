const mongoose = require("mongoose");
const connectDB = async() => {
    try{
        const conn = await mongoose.connect("mongodb://localhost:27017/Hackathon",
        {useNewUrlParser: true,
        useUnifiedTopology:true});
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};
module.exports = connectDB;

