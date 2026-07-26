import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/schemas';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:     { type: string, example: "Aarav Sharma" }
 *               email:    { type: string, example: "aarav@example.com" }
 *               password: { type: string, example: "securepass123" }
 *               role:     { type: string, enum: [user, artisan], example: "user" }
 *     responses:
 *       201: { description: Account created }
 *       400: { description: Email already exists }
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns JWT token }
 *       401: { description: Invalid credentials }
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Auth]
 *     security: []
 */
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token from email
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema: { type: string }
 */
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get currently logged-in user
 *     tags: [Auth]
 */
router.get('/me', protect, getMe);

export default router;