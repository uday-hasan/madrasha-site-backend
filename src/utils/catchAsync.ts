import { Request, Response, NextFunction } from "express";

// ================================
// catchAsync
// Wraps an async Express route handler to automatically
// catch any errors and pass them to next(error).
//
// Without catchAsync, you'd need try/catch in every controller:
//   async (req, res, next) => {
//     try {
//       await someAsyncOperation();
//     } catch (error) {
//       next(error); // without this, Express hangs forever
//     }
//   }
//
// With catchAsync, you just write:
//   catchAsync(async (req, res) => {
//     await someAsyncOperation();
//   })
//
// Any thrown error (including AppError) is automatically
// forwarded to the global error handler middleware.
// ================================

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
