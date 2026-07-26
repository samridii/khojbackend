import mongoose, { Document, Schema } from 'mongoose';

export interface IJournal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  mood: 'peaceful' | 'excited' | 'reflective' | 'adventurous' | 'grateful' | 'nostalgic';
  location?: string;
  district?: string;
  photos: string[];
  tags: string[];
  visitDate: Date;
}

const JournalSchema = new Schema<IJournal>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:     { type: String, required: true, trim: true },
    content:   { type: String, required: true },
    mood:      {
      type: String,
      enum: ['peaceful', 'excited', 'reflective', 'adventurous', 'grateful', 'nostalgic'],
      required: true,
    },
    location:  { type: String },
    district:  { type: String },
    photos:    [{ type: String }],
    tags:      [{ type: String }],
    visitDate: { type: Date, required: true },
  },
  { timestamps: true }
);

JournalSchema.index({ userId: 1, visitDate: -1 });

export default mongoose.model<IJournal>('Journal', JournalSchema);