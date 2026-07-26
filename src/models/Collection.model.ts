import mongoose, { Document, Schema } from 'mongoose';

export interface ICollectionItem {
  itemType: 'craft' | 'food' | 'festival' | 'community' | 'music' | 'artisan' | 'workshop' | 'ai_match';
  itemId: mongoose.Types.ObjectId;
  note?: string;
  savedAt: Date;
}

export interface ICollection extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  items: ICollectionItem[];
}

const CollectionItemSchema = new Schema<ICollectionItem>(
  {
    itemType: {
      type: String,
      enum: ['craft', 'food', 'festival', 'community', 'music', 'artisan', 'workshop', 'ai_match'],
      required: true,
    },
    itemId:  { type: Schema.Types.ObjectId, required: true },
    note:    { type: String },
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CollectionSchema = new Schema<ICollection>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String },
    coverImage:  { type: String },
    isPublic:    { type: Boolean, default: false },
    items:       [CollectionItemSchema],
  },
  { timestamps: true }
);

CollectionSchema.index({ userId: 1 });

export default mongoose.model<ICollection>('Collection', CollectionSchema);