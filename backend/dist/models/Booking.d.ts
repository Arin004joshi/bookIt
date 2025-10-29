import mongoose from 'mongoose';
import type { IBooking } from './interfaces.js';
declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, {}> & IBooking & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Booking;
//# sourceMappingURL=Booking.d.ts.map