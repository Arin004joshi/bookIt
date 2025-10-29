import mongoose, { Document, Schema } from 'mongoose';
const SlotSchema = new Schema({
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    capacity: { type: Number, required: true, default: 10 },
    availableSeats: { type: Number, required: true, default: 10 },
    isSoldOut: { type: Boolean, required: true, default: false },
}, { _id: true }); // Slots are embedded, so _id isn't strictly necessary
const ExperienceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    slots: [SlotSchema], // Embedding the slots schema
}, { timestamps: true });
const Experience = mongoose.model('Experience', ExperienceSchema);
export default Experience;
//# sourceMappingURL=Experience.js.map