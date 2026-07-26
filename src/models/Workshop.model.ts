import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkshop extends Document {
  artisanId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  craft: string;
  location: string;
  district: string;
  duration: number;
  price: number;
  capacity: number;
  images: string[];
  tags: string[];
  includes: string[];
  isActive: boolean;
}

const WorkshopSchema = new Schema<IWorkshop>(
  {
    artisanId:   { type: Schema.Types.ObjectId, ref: 'Artisan', required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    craft:       { type: String, required: true },
    location:    { type: String, required: true },
    district:    { type: String, required: true },
    duration:    { type: Number, required: true },
    price:       { type: Number, required: true, min: 0 },
    capacity:    { type: Number, required: true, min: 1 },
    images:      [{ type: String }],
    tags:        [{ type: String }],
    includes:    [{ type: String }],
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

WorkshopSchema.index({ artisanId: 1, isActive: 1 });
WorkshopSchema.index({ craft: 1, district: 1 });

export default mongoose.model<IWorkshop>('Workshop', WorkshopSchema);