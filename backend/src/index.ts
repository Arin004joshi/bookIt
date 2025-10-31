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

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));

// 1. DEFINE API ROUTES FIRST
app.use('/api/v1', apiRoutes);

// 2. DEFINE HEALTH CHECK ROUTE
app.get('/', (req: Request, res: Response) => {
  res.send('Booklt Backend API is running...');
});

// 3. DEFINE STATIC ASSETS AND SPA CATCH-ALL (FOR PRODUCTION)
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();

  // FIX 1: Go UP one level (../) to find the frontend/dist folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // FIX 2: Go UP one level (../) to find the index.html
  app.get(/.*/, (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'))
  );
}

// 4. DEFINE ERROR HANDLER
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 5. (CRITICAL FIX) START THE SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;