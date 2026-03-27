// ================================
// AppError
// A custom error class that extends the built-in Error.
// We use this to throw "expected" errors (like 404, 401)
// with an HTTP status code attached.
//
// Usage:
//   throw new AppError('User not found', 404);
//   throw new AppError('Unauthorized', 401);
// ================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    // "operational" = expected error (bad input, not found, etc.)
    // "non-operational" = programmer error (bugs) — these crash the app
    isOperational = true,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly (required when extending built-ins in TS)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
