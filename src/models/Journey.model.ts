import mongoose, { Document, Schema } from 'mongoose';

export interface IJourneyStop {
  time?: string;
  place: string;
  type: 'cultural_site' | 'workshop' | 'food' | 'festival' | 'rest';
  description: string;
  tip?: string;
}

export interface IJourneyDay {
  day: number;
  title: string;
  region: string;
  stops: IJourneyStop[];
  etiquetteTips: string[];
}

export interface IJourney extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  durationDays: number;
  budget: 'budget' | 'mid-range' | 'luxury';
  startCity: string;
  travelStyle: string;
  interests: string[];
  groupType: string;
  ethnicFocus?: string;
  days: IJourneyDay[];
  isShared: boolean;
  shareToken?: string;
}

const JourneyStopSchema = new Schema<IJourneyStop>(
  {
    time:        { type: String },
    place:       { type: String, required: true },
    type:        { type: String, enum: ['cultural_site', 'workshop', 'food', 'festival', 'rest'], required: true },
    description: { type: String, required: true },
    tip:         { type: String },
  },
  { _id: false }
);

const JourneyDaySchema = new Schema<IJourneyDay>(
  {
    day:           { type: Number, required: true },
    title:         { type: String, required: true },
    region:        { type: String, required: true },
    stops:         [JourneyStopSchema],
    etiquetteTips: [{ type: String }],
  },
  { _id: false }
);

const JourneySchema = new Schema<IJourney>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:        { type: String, required: true },
    durationDays: { type: Number, required: true },
    budget:       { type: String, enum: ['budget', 'mid-range', 'luxury'], required: true },
    startCity:    { type: String, required: true },
    travelStyle:  { type: String, required: true },
    interests:    [{ type: String }],
    groupType:    { type: String, required: true },
    ethnicFocus:  { type: String },
    days:         [JourneyDaySchema],
    isShared:     { type: Boolean, default: false },
    shareToken:   { type: String },
  },
  { timestamps: true }
);

JourneySchema.index({ userId: 1 });

export default mongoose.model<IJourney>('Journey', JourneySchema);