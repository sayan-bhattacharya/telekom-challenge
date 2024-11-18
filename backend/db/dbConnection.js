// db/dbConnection.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
try {
const connection = await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");
console.log(connection.connection.db.databaseName);
} catch (error) {
console.log("Connection error:", error.stack);
}
};

export default connectDB;