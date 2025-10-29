import { Document, Types } from 'mongoose';
export interface ISlot {
    date: Date;
    startTime: string;
    endTime: string;
    capacity: number;
    availableSeats: number;
    isSoldOut: boolean;
}
export interface IExperience extends Document {
    title: string;
    description: string;
    price: number;
    duration: string;
    location: string;
    imageUrl: string;
    slots: ISlot[];
}
export interface IBooking extends Document {
    experience: Types.ObjectId;
    experienceTitle: string;
    slotId: string;
    date: Date;
    startTime: string;
    userFullName: string;
    userEmail: string;
    promoCodeApplied: string | null;
    discountAmount: number;
    finalPrice: number;
    numberOfPeople: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    bookingReference: string;
}
//# sourceMappingURL=interfaces.d.ts.map