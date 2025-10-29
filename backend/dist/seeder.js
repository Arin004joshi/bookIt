import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Experience from './models/Experience.js';
import Booking from './models/Booking.js';
import { experienceData } from './data/experiences.js';
// Load environment variables
dotenv.config({ path: './.env' });
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined.");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected for Seeding.`);
    }
    catch (error) {
        const err = error;
        console.error(`Error connecting to DB: ${err.message}`);
        process.exit(1);
    }
};
// --- Import Data Function ---
const importData = async () => {
    await connectDB();
    try {
        // Clear out old data
        await Booking.deleteMany({});
        await Experience.deleteMany({});
        // Insert new data
        await Experience.insertMany(experienceData);
        console.log('Data Imported Successfully!');
        process.exit();
    }
    catch (error) {
        const err = error;
        console.error(`Error with data import: ${err.message}`);
        process.exit(1);
    }
};
// --- Destroy Data Function ---
const destroyData = async () => {
    await connectDB();
    try {
        await Booking.deleteMany({});
        await Experience.deleteMany({});
        console.log('Data Destroyed Successfully!');
        process.exit();
    }
    catch (error) {
        const err = error;
        console.error(`Error with data destruction: ${err.message}`);
        process.exit(1);
    }
};
// Run based on command-line argument
if (process.argv[2] === '-d') {
    destroyData();
}
else {
    importData();
}
//# sourceMappingURL=seeder.js.map