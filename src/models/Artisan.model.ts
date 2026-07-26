import mongoose, { Document, Schema } from 'mongoose';

export interface IArtisan extends Document {
  userId: mongoose.Types.ObjectId;
  craft: string;
  location: string;
  district: string;
  bio: string;
  specialties: string[];
  experience: number;
  isAvailable: boolean;
  coverImage?: string;
  gallery: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

const ArtisanSchema = new Schema<IArtisan>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    craft:       { type: String, required: true },
    location:    { type: String, required: true },
    district:    { type: String, required: true },
    bio:         { type: String, required: true },
    specialties: [{ type: String }],
    experience:  { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    coverImage:  { type: String },
    gallery:     [{ type: String }],
    socialLinks: {
      instagram: String,
      facebook:  String,
      website:   String,
    },
  },
  { timestamps: true }
);

ArtisanSchema.index({ craft: 1, district: 1 });

export default mongoose.model<IArtisan>('Artisan', ArtisanSchema);