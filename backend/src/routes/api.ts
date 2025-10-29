import { Router } from 'express';

import { getExperiences, getExperienceById } from '../controllers/experienceController.js';
import { createBooking, validatePromo } from '../controllers/bookingController.js';

const router = Router();

// Experience APIs
router.get('/experiences', getExperiences);
router.get('/experiences/:id', getExperienceById);

// Booking and Promo APIs
router.post('/bookings', createBooking);
router.post('/promo/validate', validatePromo);

export default router;