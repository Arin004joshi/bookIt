import express from 'express';
import type { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js'; // Import our routes

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON requests
// Add CORS if necessary, but we'll skip it for initial setup

// Basic health check
app.get('/', (req: Request, res: Response) => {
    res.send('Booklt Backend API is running...');
});

// Main API routes
app.use('/api/v1', apiRoutes); // All endpoints will be prefixed with /api/v1

// Error handling middleware (Good practice)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});