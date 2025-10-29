import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        // TypeScript type assertion for error
        const err = error;
        console.error(`Error: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map