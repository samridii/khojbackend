import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import errorHandler from './middleware/error.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/ai.routes';
import bookingRoutes from './routes/booking.routes';
import { workshopRouter, artisanRouter } from './routes/workshop.routes';
import { collectionRouter, journeyRouter, journalRouter } from './routes/user.routes';
import { craftRouter, foodRouter, communityRouter, festivalRouter, musicRouter } from './routes/content.routes';

const app = express();

// Security
app.use(helmet());

// CORS — allow frontend dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL || ''].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rate limiting
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests from this IP.' });

app.use(globalLimiter);
app.use('/api/auth', authLimiter);

// Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', project: 'KHOJ API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth',        authRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/bookings',    bookingRoutes);
app.use('/api/workshops',   workshopRouter);
app.use('/api/artisans',    artisanRouter);
app.use('/api/collections', collectionRouter);
app.use('/api/journeys',    journeyRouter);
app.use('/api/journal',     journalRouter);
app.use('/api/crafts',      craftRouter);
app.use('/api/foods',       foodRouter);
app.use('/api/communities', communityRouter);
app.use('/api/festivals',   festivalRouter);
app.use('/api/music',       musicRouter);

// 404
app.use('*', (_, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use(errorHandler);

export default app;