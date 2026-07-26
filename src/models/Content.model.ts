import mongoose, { Document, Schema } from 'mongoose';

// Shared content base
const baseContentFields = {
  title:           { type: String, required: true, trim: true },
  slug:            { type: String, required: true, unique: true, lowercase: true },
  description:     { type: String, required: true },
  longDescription: { type: String },
  region:          { type: String, required: true },
  district:        { type: String },
  images:          [{ type: String }],
  tags:            [{ type: String }],
  isActive:        { type: Boolean, default: true },
};

// Craft
export interface ICraft extends Document {
  title: string; slug: string; description: string; longDescription?: string;
  region: string; district?: string; images: string[]; tags: string[];
  materials: string[]; significance?: string; isActive: boolean;
}

const CraftSchema = new Schema<ICraft>(
  { ...baseContentFields, materials: [{ type: String }], significance: { type: String } },
  { timestamps: true }
);

// Only keep the compound index — slug uniqueness is handled by the field definition
CraftSchema.index({ tags: 1, region: 1 });

export const Craft = mongoose.model<ICraft>('Craft', CraftSchema);

// Food
export interface IFood extends Document {
  title: string; slug: string; description: string; longDescription?: string;
  region: string; district?: string; images: string[]; tags: string[];
  cuisine: string; ingredients: string[]; isVegetarian: boolean;
  festival?: string; isActive: boolean;
}

const FoodSchema = new Schema<IFood>(
  {
    ...baseContentFields,
    cuisine:      { type: String },
    ingredients:  [{ type: String }],
    isVegetarian: { type: Boolean, default: false },
    festival:     { type: String },
  },
  { timestamps: true }
);

export const Food = mongoose.model<IFood>('Food', FoodSchema);

// Community
export interface ICommunity extends Document {
  title: string; slug: string; description: string; longDescription?: string;
  region: string; district?: string; images: string[]; tags: string[];
  language: string; traditions: string[]; population?: string; isActive: boolean;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    ...baseContentFields,
    language:   { type: String },
    traditions: [{ type: String }],
    population: { type: String },
  },
  { timestamps: true }
);

export const Community = mongoose.model<ICommunity>('Community', CommunitySchema);

// Festival
export interface IFestival extends Document {
  title: string; slug: string; description: string; longDescription?: string;
  region: string; district?: string; images: string[]; tags: string[];
  month: string; duration: string; celebratedBy: string[]; rituals: string[];
  isActive: boolean;
}

const FestivalSchema = new Schema<IFestival>(
  {
    ...baseContentFields,
    month:        { type: String },
    duration:     { type: String },
    celebratedBy: [{ type: String }],
    rituals:      [{ type: String }],
  },
  { timestamps: true }
);

export const Festival = mongoose.model<IFestival>('Festival', FestivalSchema);

// Music
export interface IMusic extends Document {
  title: string; slug: string; description: string; longDescription?: string;
  region: string; district?: string; images: string[]; tags: string[];
  instruments: string[]; occasions: string[]; audioSample?: string; isActive: boolean;
}

const MusicSchema = new Schema<IMusic>(
  {
    ...baseContentFields,
    instruments: [{ type: String }],
    occasions:   [{ type: String }],
    audioSample: { type: String },
  },
  { timestamps: true }
);

export const Music = mongoose.model<IMusic>('Music', MusicSchema);