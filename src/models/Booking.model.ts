import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  workshopId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  participants: number;
  status: BookingStatus;
  note?: string;
  artisanNote?: string;
  cancelledBy?: 'user' | 'artisan';
}

const BookingSchema = new Schema<IBooking>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workshopId:    { type: Schema.Types.ObjectId, ref: 'Workshop', required: true },
    scheduledDate: { type: Date, required: true },
    participants:  { type: Number, required: true, min: 1 },
    status:        { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    note:          { type: String },
    artisanNote:   { type: String },
    cancelledBy:   { type: String, enum: ['user', 'artisan'] },
  },
  { timestamps: true }
);

BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ workshopId: 1, status: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);