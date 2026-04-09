import mongoose from "mongoose";
import logger from "../utils/logger.js";
import config from "./index.js";

export const connectDB = async () => {
    // const uri = "mongodb+srv://nimsdtmg_db_user:NWoCpHAP1jqkoZsJ@learningcluster.34hhusg.mongodb.net/?appName=learningcluster";
    try {
        await mongoose.connect(config.database.mongoUri);
        // console.log("mongodb connected successfully");
        logger.info({
            database: 'mongodb',
            host: mongoose.connection.host
        }, "Database connected successfully");
    } catch (error) {
        // console.error("MongoDB connection error:", error);
        logger.fatal({err: error}, "Database connection failed")
        process.exit(1);
    }
};
if (!config.app.isProduction) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug({
            collection: collectionName,
            method,
            query,
        }, 'Mongoose query');
    });
}