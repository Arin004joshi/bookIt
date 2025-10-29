import type { Request, Response } from 'express';
import Experience from '../models/Experience.js';
import type { ISlot } from '../models/interfaces.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Helper function for simple email validation
const isValidEmail = (email: string): boolean => {
    // Basic regex for email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Helper function to generate a unique booking reference
const generateBookingRef = (): string => {
    return uuidv4().substring(0, 8).toUpperCase(); // e.g., F8A9C1D2
};

// 4. POST /promo/validate - Validate promo codes (e.g. SAVE10, FLAT100)
export const validatePromo = async (req: Request, res: Response) => {
    const { code, originalPrice } = req.body;

    // Minimal validation
    if (!code || typeof originalPrice !== 'number' || originalPrice <= 0) {
        return res.status(400).json({
            message: 'Invalid request payload for promo validation'
        });
    }

    // --- Promo Logic: Secure and Simple Example ---
    let discountAmount = 0;
    let discountedPrice = originalPrice;
    const promoCode = code.toUpperCase();

    if (promoCode === 'SAVE10') {
        // 10% off
        discountAmount = originalPrice * 0.10;
        discountedPrice = originalPrice - discountAmount;
    } else if (promoCode === 'FLAT100') {
        // Flat 100 unit discount
        discountAmount = 100;
        discountedPrice = Math.max(0, originalPrice - discountAmount); // Ensure price isn't negative
    } else {
        // Invalid code
        return res.status(404).json({
            message: 'Invalid promo code',
            discountAmount: 0,
            finalPrice: originalPrice
        });
    }

    res.json({
        message: 'Promo code applied successfully',
        promoCode: promoCode,
        discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
        finalPrice: Math.round(discountedPrice * 100) / 100,
    });
};


// 3. POST /bookings - Accept booking details and store them
export const createBooking = async (req: Request, res: Response) => {
    const {
        experienceId,
        slotId,
        userFullName,
        userEmail,
        numberOfPeople,
        finalPrice, // Must be calculated client-side (Checkout)
        promoCodeApplied,
        discountAmount
    } = req.body;

    // --- 1. Minimal Form Validation (Required fields)  ---
    if (!experienceId || !slotId || !userFullName || !userEmail || !numberOfPeople || !finalPrice) {
        return res.status(400).json({ message: 'Missing required booking fields.' });
    }

    // Basic email validation
    if (!isValidEmail(userEmail)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (numberOfPeople < 1) {
        return res.status(400).json({ message: 'Must book for at least 1 person.' });
    }

    // --- 2. Transaction for Double-Booking Prevention  ---
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // A. Find the experience and the specific slot
        const experience = await Experience.findById(experienceId).session(session);

        if (!experience) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Experience not found.' });
        }

        // Find the slot by its _id within the array
        // FIX 4: Use 'any' or check your ISlot definition. Mongoose sub-documents have an _id, but the TS interface might be missing it. Using 'any' as a quick fix, but you should update the ISlot interface in '../models/Experience.js' to extend Mongoose's Document type or explicitly add: '_id: Types.ObjectId | string;'
        const slotIndex = experience.slots.findIndex((s: any) => s._id.toString() === slotId);

        if (slotIndex === -1) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Slot not found or invalid.' });
        }

        const slot = experience.slots[slotIndex] as ISlot;

        // B. Check for availability (Crucial step for prevention)
        if (slot.availableSeats < numberOfPeople) {
            await session.abortTransaction();
            return res.status(409).json({ message: `Not enough seats available. Only ${slot.availableSeats} remaining.` });
        }

        // C. Decrease the available seats and update sold-out status
        slot.availableSeats -= numberOfPeople;
        if (slot.availableSeats === 0) {
            slot.isSoldOut = true;
        }

        // Update the experience document with the modified slot
        await experience.save({ session });

        // D. Create the new booking record
        const newBooking = new Booking({
            experience: experienceId,
            experienceTitle: experience.title,
            slotId: slotId,
            date: slot.date,
            startTime: slot.startTime,
            userFullName,
            userEmail,
            promoCodeApplied: promoCodeApplied || null,
            discountAmount: discountAmount || 0,
            finalPrice,
            numberOfPeople,
            bookingReference: generateBookingRef(),
            status: 'Confirmed',
        });

        await newBooking.save({ session });

        // E. Commit the transaction
        await session.commitTransaction();

        // Successful response (Result Page data)
        res.status(201).json({
            message: 'Booking successfully confirmed!',
            booking: {
                bookingReference: newBooking.bookingReference,
                experienceTitle: newBooking.experienceTitle,
                date: newBooking.date,
                startTime: newBooking.startTime,
                finalPrice: newBooking.finalPrice,
            }
        });

    } catch (error) {
        // If anything fails, abort the transaction to undo changes
        await session.abortTransaction();
        const err = error as Error;
        res.status(500).json({ message: 'Booking failed due to a server error.', error: err.message });
    } finally {
        session.endSession();
    }
};