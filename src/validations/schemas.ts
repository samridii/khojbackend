import Joi from 'joi';

// ─── Auth ─────────────────────────────────────────────────────────────────

export const registerSchema = Joi.object({
  name:     Joi.string().min(2).max(60).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role:     Joi.string().valid('user', 'artisan').default('user'),
});

export const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
});

// ─── Booking ──────────────────────────────────────────────────────────────

export const createBookingSchema = Joi.object({
  workshopId:    Joi.string().required(),
  scheduledDate: Joi.date().min('now').required(),
  participants:  Joi.number().integer().min(1).required(),
  note:          Joi.string().max(500).optional(),
});

export const updateBookingSchema = Joi.object({
  scheduledDate: Joi.date().min('now').optional(),
  participants:  Joi.number().integer().min(1).optional(),
  note:          Joi.string().max(500).optional(),
});

export const updateBookingStatusSchema = Joi.object({
  status:      Joi.string().valid('confirmed', 'completed', 'cancelled').required(),
  artisanNote: Joi.string().max(500).optional(),
});

// ─── Collection ───────────────────────────────────────────────────────────

export const createCollectionSchema = Joi.object({
  title:       Joi.string().min(2).max(80).required(),
  description: Joi.string().max(300).optional(),
  isPublic:    Joi.boolean().default(false),
});

export const updateCollectionSchema = Joi.object({
  title:       Joi.string().min(2).max(80).optional(),
  description: Joi.string().max(300).optional(),
  isPublic:    Joi.boolean().optional(),
  coverImage:  Joi.string().uri().optional(),
});

export const addCollectionItemSchema = Joi.object({
  itemType: Joi.string()
    .valid('craft', 'food', 'festival', 'community', 'music', 'artisan', 'workshop', 'ai_match')
    .required(),
  itemId: Joi.string().required(),
  note:   Joi.string().max(300).optional(),
});

// ─── Journey ──────────────────────────────────────────────────────────────

export const saveJourneySchema = Joi.object({
  title:        Joi.string().min(2).max(100).required(),
  durationDays: Joi.number().integer().min(1).max(30).required(),
  budget:       Joi.string().valid('budget', 'mid-range', 'luxury').required(),
  startCity:    Joi.string().required(),
  travelStyle:  Joi.string().required(),
  interests:    Joi.array().items(Joi.string()).required(),
  groupType:    Joi.string().required(),
  ethnicFocus:  Joi.string().optional(),
  days:         Joi.array().required(),
});

// ─── Journal ──────────────────────────────────────────────────────────────

export const createJournalSchema = Joi.object({
  title:     Joi.string().min(2).max(120).required(),
  content:   Joi.string().min(10).required(),
  mood:      Joi.string()
    .valid('peaceful', 'excited', 'reflective', 'adventurous', 'grateful', 'nostalgic')
    .required(),
  location:  Joi.string().optional(),
  district:  Joi.string().optional(),
  photos:    Joi.array().items(Joi.string()).optional(),
  tags:      Joi.array().items(Joi.string()).optional(),
  visitDate: Joi.date().required(),
});

export const updateJournalSchema = Joi.object({
  title:     Joi.string().min(2).max(120).optional(),
  content:   Joi.string().min(10).optional(),
  mood:      Joi.string()
    .valid('peaceful', 'excited', 'reflective', 'adventurous', 'grateful', 'nostalgic')
    .optional(),
  location:  Joi.string().optional(),
  district:  Joi.string().optional(),
  photos:    Joi.array().items(Joi.string()).optional(),
  tags:      Joi.array().items(Joi.string()).optional(),
  visitDate: Joi.date().optional(),
});

// ─── AI ───────────────────────────────────────────────────────────────────

export const aiCompassSchema = Joi.object({
  inputText: Joi.string().min(3).max(500).required(),
  moodTags:  Joi.array().items(Joi.string()).min(1).required(),
});

export const aiJourneySchema = Joi.object({
  durationDays: Joi.number().integer().min(1).max(30).required(),
  budget:       Joi.string().valid('budget', 'mid-range', 'luxury').required(),
  startCity:    Joi.string().required(),
  travelStyle:  Joi.string().required(),
  interests:    Joi.array().items(Joi.string()).min(1).required(),
  groupType:    Joi.string().required(),
  ethnicFocus:  Joi.string().optional(),
});

// ─── Artisan ──────────────────────────────────────────────────────────────

export const updateArtisanSchema = Joi.object({
  craft:       Joi.string().optional(),
  location:    Joi.string().optional(),
  district:    Joi.string().optional(),
  bio:         Joi.string().max(1000).optional(),
  specialties: Joi.array().items(Joi.string()).optional(),
  experience:  Joi.number().min(0).optional(),
  isAvailable: Joi.boolean().optional(),
  socialLinks: Joi.object({
    instagram: Joi.string().uri().optional(),
    facebook:  Joi.string().uri().optional(),
    website:   Joi.string().uri().optional(),
  }).optional(),
});