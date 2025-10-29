import { Document, Types } from 'mongoose';

// Interface for a single slot within an experience
export interface ISlot {
    date: Date;
    startTime: string; // e.g., "10:00"
    endTime: string;   // e.g., "12:00"
    capacity: number;
    availableSeats: number; // Decrement this on booking
    isSoldOut: boolean;
}

// Interface for the Experience document
export interface IExperience extends Document {
    title: string;
    description: string;
    price: number;
    duration: string; // e.g., "2 hours"
    location: string;
    imageUrl: string;
    slots: ISlot[]; // Array of available slots
}

// Interface for the Booking document
export interface IBooking extends Document {
    experience: Types.ObjectId; // Reference to Experience
    experienceTitle: string;
    slotId: string; // ID of the booked slot (from the Experience document)
    date: Date;
    startTime: string;
    userFullName: string;
    userEmail: string;
    promoCodeApplied: string | null;
    discountAmount: number;
    finalPrice: number;
    numberOfPeople: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    bookingReference: string; // Unique reference for the user
}