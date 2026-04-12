import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { env, isDevelopment } from './config/env';
import { logger } from './config/logger';
import { swaggerSpec } from './config/swagger';
import { apiLimiter } from './middlewares/rateLimiter';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import router from './routes';

// ================================
// EXPRESS APP
// Separated from server.ts so we can import it in tests
// without starting the actual server.
// ================================

const app = express();

// Trust proxy - REQUIRED for secure cookies behind reverse proxy (Nginx)
app.set('trust proxy', 1);

// ================================
// SECURITY MIDDLEWARES
// Applied first, before any routes
// ================================

// helmet — sets ~15 security-related HTTP headers automatically
// (Content-Security-Policy, X-Frame-Options, etc.)
app.use(
  helmet({
    // Allow images to be loaded from your backend to your frontend
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // Only if you are using Swagger or loading external scripts
    contentSecurityPolicy: isDevelopment ? false : undefined,
  }),
);

// cors — controls which origins can call our API
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // Required for cookies to be sent cross-origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rate limiting — applied to all API routes
app.use(`/api/${env.API_VERSION}`, apiLimiter);

// ================================
// GENERAL MIDDLEWARES
// ================================

// compression — gzip responses (reduces bandwidth by ~70%)
app.use(compression());

// Parse JSON bodies (max 10kb to prevent large payload attacks)
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parse cookies
app.use(cookieParser(env.COOKIE_SECRET));

// HTTP request logging (only in development)
if (isDevelopment) {
  app.use(
    morgan('dev', {
      stream: { write: (message) => logger.http(message.trim()) },
    }),
  );
}

// ================================
// HEALTH CHECK
// Used by load balancers, uptime monitors, and CI/CD
// to verify the server is running
// ================================
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ================================
// STATIC FILES
// Serve uploaded files from the uploads directory
// ================================
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
// app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

// ================================
// API DOCS (Swagger)
// Only available in non-production environments
// ================================
if (!env.NODE_ENV.includes('production')) {
  app.use(`/api/${env.API_VERSION}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info(`📚 Swagger docs available at /api/${env.API_VERSION}/docs`);
}

// ================================
// API ROUTES
// ================================
app.use(`/api/${env.API_VERSION}`, router);

// ================================
// ERROR HANDLING
// Must be registered AFTER all routes
// ================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
