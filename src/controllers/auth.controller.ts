import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response.util';
import { authService } from '../services/auth.service';

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const result = await authService.register(name, email, password, role);
  sendSuccess(res, result, 'Account created successfully.', 201);
});

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, result, 'Logged in successfully.');
});

/**
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  // Always return success so we don't reveal whether an email exists
  sendSuccess(res, null, 'If that email exists, a reset link has been sent.');
});

/**
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.params.token, req.body.password);
  sendSuccess(res, null, 'Password reset successfully. Please log in.');
});

/**
 * @route   GET /api/auth/me
 * @access  Protected
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, user);
});