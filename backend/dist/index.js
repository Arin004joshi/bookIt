import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import cors from "cors";
// You can also remove the 'path' import, it's no longer used
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
// Your CORS setup (this is correct)
const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));
// API ROUTES
app.use('/api/v1', apiRoutes);
// HEALTH CHECK ROUTE
app.get('/', (req, res) => {
    res.send('Booklt Backend API is running...');
});
// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
// --- END OF NEW CODE BLOCK ---
export default app;
//# sourceMappingURL=index.js.map