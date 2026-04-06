import { z } from 'zod';

// ================================
// NOTICE VALIDATION SCHEMAS
// ================================

export const createNoticeSchema = {
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(2, 'Title must be at least 2 characters')
      .max(300, 'Title must be less than 300 characters')
      .trim(),

    content: z
      .string({ required_error: 'Content is required' })
      .min(10, 'Content must be at least 10 characters')
      .trim(),

    category: z.string().min(1).max(100).trim().default('general'),

    featured: z.boolean().default(false),

    slug: z.string().min(2).max(300).trim().optional(),
  }),
};

export const updateNoticeSchema = {
  body: z.object({
    title: z
      .string()
      .min(2, 'Title must be at least 2 characters')
      .max(300)
      .trim()
      .optional(),

    content: z
      .string()
      .min(10, 'Content must be at least 10 characters')
      .trim()
      .optional(),

    category: z.string().min(1).max(100).trim().optional(),

    featured: z.boolean().optional(),

    slug: z.string().min(2).max(300).trim().optional(),
  }),

  params: z.object({
    id: z.string().min(1, 'Notice ID is required'),
  }),
};

export const noticeIdParamSchema = {
  params: z.object({
    id: z.string().min(1, 'Notice ID is required'),
  }),
};

export const noticeQuerySchema = {
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    featured: z
      .string()
      .optional()
      .transform((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return undefined;
      }),
    category: z.string().optional(),
    search: z.string().optional(),
  }),
};

export type CreateNoticeInput = z.infer<typeof createNoticeSchema.body>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema.body>;
export type NoticeQuery = z.infer<typeof noticeQuerySchema.query>;
