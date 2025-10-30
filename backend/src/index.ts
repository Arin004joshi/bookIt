import express from 'express';
import type { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import cors from "cors";

// Load environment variables (keep this)
dotenv.config();

// Connect to Database (keep this, it runs immediately)
connectDB();

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

// Basic health check
app.get('/', (req: Request, res: Response) => {
    res.send('Booklt Backend API is running...');
});

// Main API routes
app.use('/api/v1', apiRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 🌟 VERCEL FIX: EXPORT THE APP INSTANCE 🌟
export default app;