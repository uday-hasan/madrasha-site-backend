import { z } from 'zod';

// ================================
// DEPARTMENT VALIDATION SCHEMAS
// ================================

export const createDepartmentSchema = {
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(200, 'Name must be less than 200 characters')
      .trim(),

    description: z
      .string({ required_error: 'Description is required' })
      .min(10, 'Description must be at least 10 characters')
      .trim(),

    duration: z
      .string({ required_error: 'Duration is required' })
      .min(1, 'Duration is required')
      .max(100)
      .trim(),

    subjects: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return val.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
        return val ?? [];
      }),

    headTeacher: z.string().max(200).trim().optional(),

    totalStudents: z
      .union([z.number(), z.string()])
      .optional()
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) || 0 : val ?? 0)),

    imageUrl: z.string().url('Invalid image URL').optional(),

    isActive: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === 'boolean') return val;
        return val === 'true';
      })
      .default(true),

    displayOrder: z
      .union([z.number(), z.string()])
      .optional()
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) || 0 : val ?? 0))
      .default(0),

    slug: z.string().min(2).max(200).trim().optional(),
  }),
};

export const updateDepartmentSchema = {
  body: z.object({
    name: z.string().min(2).max(200).trim().optional(),

    description: z.string().min(10).trim().optional(),

    duration: z.string().min(1).max(100).trim().optional(),

    subjects: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch {
            return val.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
        return val;
      }),

    headTeacher: z.string().max(200).trim().optional(),

    totalStudents: z
      .union([z.number(), z.string()])
      .optional()
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) || 0 : val)),

    imageUrl: z.string().url('Invalid image URL').optional(),

    isActive: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === 'boolean') return val;
        if (val === 'true') return true;
        if (val === 'false') return false;
        return undefined;
      }),

    displayOrder: z
      .union([z.number(), z.string()])
      .optional()
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) || 0 : val)),

    slug: z.string().min(2).max(200).trim().optional(),
  }),

  params: z.object({
    id: z.string().min(1, 'Department ID is required'),
  }),
};

export const departmentIdParamSchema = {
  params: z.object({
    id: z.string().min(1, 'Department ID is required'),
  }),
};

export const departmentQuerySchema = {
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    isActive: z
      .string()
      .optional()
      .transform((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return undefined;
      }),
    search: z.string().optional(),
  }),
};

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema.body>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema.body>;
export type DepartmentQuery = z.infer<typeof departmentQuerySchema.query>;
