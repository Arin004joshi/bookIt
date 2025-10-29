import mongoose, { Document, Schema } from 'mongoose';
const BookingSchema = new Schema({
    experience: {
        type: Schema.Types.ObjectId,
        ref: 'Experience',
        required: true
    },
    experienceTitle: { type: String, required: true },
    slotId: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    userFullName: { type: String, required: true },
    userEmail: { type: String, required: true },
    promoCodeApplied: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    numberOfPeople: { type: Number, required: true, min: 1 },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Confirmed'
    },
    bookingReference: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });
const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
//# sourceMappingURL=Booking.js.map