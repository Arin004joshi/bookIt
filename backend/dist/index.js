import 'dotenv/config';
import express from 'express';
// import experienceRoutes from './routes/experienceRoutes';
// import bookingRoutes from './routes/bookingRoutes';
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
// app.use(cors()); 
// app.use('/experiences', experienceRoutes);
// app.use('/bookings', bookingRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map