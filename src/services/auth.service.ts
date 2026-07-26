import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { userRepository } from '../repositories/user.repository';
import { signToken } from '../utils/jwt.util';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email.util';

export const authService = {
  register: async (name: string, email: string, password: string, role: string) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('An account with this email already exists.');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ name, email, passwordHash, role: role as any });

    await sendWelcomeEmail(email, name).catch(() => {}); // non-blocking

    const token = signToken({ id: user._id.toString(), role: user.role });
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
  },

  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid email or password.');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid email or password.');

    const token = signToken({ id: user._id.toString(), role: user.role });
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, token };
  },

  forgotPassword: async (email: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) return; // silently succeed — don't reveal whether email exists

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await userRepository.updateById(user._id.toString(), {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    } as any);

    await sendPasswordResetEmail(email, user.name, token);
  },

  resetPassword: async (token: string, newPassword: string) => {
    const user = await userRepository.findByResetToken(token);
    if (!user) throw new Error('Reset token is invalid or has expired.');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await userRepository.updateById(user._id.toString(), {
      passwordHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    } as any);
  },

  getMe: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found.');
    return user;
  },
};