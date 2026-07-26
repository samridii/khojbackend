import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'artisan' | 'admin';
  avatar?: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:                 { type: String, required: true, trim: true },
    email:                { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash:         { type: String, required: true },
    role:                 { type: String, enum: ['user', 'artisan', 'admin'], default: 'user' },
    avatar:               { type: String },
    isVerified:           { type: Boolean, default: false },
    resetPasswordToken:   { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Removed duplicate index — email uniqueness is already enforced by unique:true on the field

export default mongoose.model<IUser>('User', UserSchema);