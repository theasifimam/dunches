import mongoose, { Schema } from 'mongoose';

const BookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    vehicle: { type: String, enum: ['Car', 'Bus', 'Truck', 'Motorcycle', 'None'], default: 'None' },
    preOrder: { type: Boolean, default: false },
    tableId: { type: String, required: true },
    specialRequests: { type: String },
    paymentMethod: { type: String, default: 'card' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'paid' },
    bookingStatus: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'confirmed' },
    bookingFee: { type: Number, default: 500 },
  },
  { timestamps: true }
);

BookingSchema.index({ date: 1, time: 1 });
BookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Booking', BookingSchema);
