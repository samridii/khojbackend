import User, { IUser } from '../models/User.model';

export const userRepository = {
  findByEmail: (email: string) =>
    User.findOne({ email }),

  findById: (id: string) =>
    User.findById(id).select('-passwordHash'),

  findByIdWithPassword: (id: string) =>
    User.findById(id),

  findByResetToken: (token: string) =>
    User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }),

  create: (data: Partial<IUser>) =>
    User.create(data),

  updateById: (id: string, data: Partial<IUser>) =>
    User.findByIdAndUpdate(id, data, { new: true }).select('-passwordHash'),

  deleteById: (id: string) =>
    User.findByIdAndDelete(id),

  findAll: (filter = {}) =>
    User.find(filter).select('-passwordHash'),
};