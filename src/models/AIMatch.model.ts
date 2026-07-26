import mongoose, { Document, Schema } from 'mongoose';

export interface IAIMatch extends Document {
  userId: mongoose.Types.ObjectId;
  inputText: string;
  moodTags: string[];
  results: {
    communities: string[];
    crafts: string[];
    foods: string[];
    festivals: string[];
    music: string[];
    regions: string[];
    culturalInsight: string;
  };
  savedToCollection?: mongoose.Types.ObjectId;
}

const AIMatchSchema = new Schema<IAIMatch>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    inputText: { type: String, required: true },
    moodTags:  [{ type: String }],
    results: {
      communities:     [{ type: String }],
      crafts:          [{ type: String }],
      foods:           [{ type: String }],
      festivals:       [{ type: String }],
      music:           [{ type: String }],
      regions:         [{ type: String }],
      culturalInsight: { type: String },
    },
    savedToCollection: { type: Schema.Types.ObjectId, ref: 'Collection' },
  },
  { timestamps: true }
);

AIMatchSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IAIMatch>('AIMatch', AIMatchSchema);