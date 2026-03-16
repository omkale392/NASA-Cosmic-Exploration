/**
 * Vercel Serverless Function Entry Point
 *
 * This file acts as the bridge between Vercel's serverless runtime
 * and the Express application defined in the backend.
 *
 * Vercel will call the default-exported handler for every request
 * that matches the /api/* route pattern defined in vercel.json.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load env vars — on Vercel these come from the project settings,
// dotenv is a no-op but kept for local parity.
dotenv.config();

// ── Route Imports ─────────────────────────────────────────────────────────────
import apodRouter from '../backend/src/routes/apod';
import aiRouter from '../backend/src/routes/ai';

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Reads allowed origins from the CORS_ORIGIN environment variable so that
// we can set it per-environment in Vercel project settings without code changes.
// Falls back to localhost for local development.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' not allowed.`));
    },
    credentials: true,
  })
);

// ── Security & Parsing ────────────────────────────────────────────────────────
app.use(
  helmet({
    // Relax CSP for API-only responses (frontend served separately by Vercel CDN)
    contentSecurityPolicy: false,
  })
);
app.use(express.json({ limit: '1mb' }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
// express-rate-limit needs a trust-proxy setting on Vercel (requests go through
// Vercel's load-balancer) to correctly identify client IPs.
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: true, message: 'Too many requests, please try again later.' },
});

app.use('/api', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/apod', apodRouter);
app.use('/api/ai', aiRouter);

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
// Vercel invokes this function for every matched request.
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as unknown as Request, res as unknown as Response);
}
