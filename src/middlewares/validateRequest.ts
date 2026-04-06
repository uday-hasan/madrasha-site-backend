import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

// ================================
// VALIDATE REQUEST MIDDLEWARE
// Validates req.body, req.params, and req.query
// against a Zod schema before the request reaches the controller.
//
// If validation fails, it throws a ZodError which is caught
// by the global error handler and returned as a 422 response.
//
// Usage:
//   router.post('/register', validateRequest(registerSchema), register);
//
// Schema structure:
//   z.object({
//     body: z.object({ email: z.string().email() }),
//     params: z.object({ id: z.string() }),
//     query: z.object({ page: z.string().optional() }),
//   })
// ================================

interface RequestSchema {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

export const validateRequest = (schema: RequestSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate and transform each part of the request
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      if (schema.query) {
        const parsed = await schema.query.parseAsync(req.query);
        // Express 5 makes req.query a getter — mutate the object in-place
        // instead of trying to replace the property reference.
        Object.assign(req.query, parsed);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error); // Passed to global error handler → 422 response
      } else {
        next(error);
      }
    }
  };
};
