import { z } from "zod";

// ================================
// USER VALIDATION SCHEMAS
// ================================

export const updateProfileSchema = {
  body: z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .trim()
        .optional(),

      email: z
        .string()
        .email("Please provide a valid email address")
        .toLowerCase()
        .trim()
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
};

export const userIdParamSchema = {
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
};

export const getUsersQuerySchema = {
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined;
      }),
  }),
};

export type UpdateProfileInput = z.infer<typeof updateProfileSchema.body>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema.query>;
