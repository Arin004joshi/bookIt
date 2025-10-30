import express from 'express';
import type { Request, Response, NextFunction } from "express"
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import cors from "cors";
import path from 'path';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
}

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
}

app.get('/', (req: Request, res: Response) => {
    res.send('Booklt Backend API is running...');
});

app.use('/api/v1', apiRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

export default app;