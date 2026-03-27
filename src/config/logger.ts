import winston from "winston";
import path from "path";
import { env, isDevelopment } from "./env";

// ================================
// WINSTON LOGGER
// Logs go to:
//   - Console (always, colored in dev)
//   - logs/error.log (errors only)
//   - logs/combined.log (all levels)
// In production, we skip verbose console output.
// ================================

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for development — human-readable
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";
    return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
  }),
);

// JSON format for production — machine-readable, easy to parse
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

// Create logs directory path
const logsDir = path.join(process.cwd(), "logs");

export const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "warn" : "debug",
  format: isDevelopment ? devFormat : prodFormat,
  transports: [
    // Console output
    new winston.transports.Console(),

    // Error log file (only errors)
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB per file
      maxFiles: 5, // Keep last 5 files
    }),

    // Combined log file (all levels)
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 10 * 1024 * 1024, // 10MB per file
      maxFiles: 5,
    }),
  ],

  // Don't crash on unhandled exceptions — log them instead
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejections.log"),
    }),
  ],
});
