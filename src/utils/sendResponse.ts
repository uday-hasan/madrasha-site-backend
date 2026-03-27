import { Response } from "express";

// ================================
// sendResponse
// A consistent response helper that ensures every API response
// has the same shape:
//   { success, message, data, meta }
//
// This makes the frontend's life much easier — they always
// know exactly what shape to expect.
//
// Usage:
//   sendResponse(res, {
//     statusCode: 200,
//     message: 'Users fetched successfully',
//     data: users,
//   });
// ================================

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  options: ApiResponse<T>,
): void => {
  const { statusCode, message, data, meta } = options;

  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data: data ?? null,
    ...(meta && { meta }),
  });
};
