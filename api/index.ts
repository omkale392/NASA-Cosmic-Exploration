/**
 * Vercel Serverless Function Entry Point
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

// ── Route Imports ─────────────────────────────────────────────────────────────
import apodRouter from '../backend/src/routes/apod';
import aiRouter from '../backend/src/routes/ai';
import neowsRouter from '../backend/src/routes/neows';

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' not allowed.`));
    },
    credentials: true,
  })
);

// ── Security & Parsing ────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many requests, please try again later.' },
});

app.use('/api', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/apod', apodRouter);
app.use('/api/ai', aiRouter);
app.use('/api/neows', neowsRouter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'NASA Mission Control API', env: process.env.NODE_ENV });
});

// ── Generic Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[NASA API Error]', err.message);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Vercel Handler Export ─────────────────────────────────────────────────────
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as unknown as Request, res as unknown as Response);
}