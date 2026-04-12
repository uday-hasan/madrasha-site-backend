import { z } from 'zod';

// ================================
// GALLERY VALIDATION SCHEMAS
// ================================

export const createGallerySchema = {
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title must be less than 200 characters')
      .trim(),

    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .trim()
      .optional(),

    mediaType: z.enum(['IMAGE', 'VIDEO']).default('IMAGE'),

    category: z.string().min(1).max(100).trim().default('general'),

    featured: z
      .string()
      .optional()
      .transform((val) => val === 'true'),

    videoUrl: z.string().url('Invalid video URL').optional(),

    imageUrl: z.string().url('Invalid image URL').optional(),
  }),
};

export const updateGallerySchema = {
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200).trim().optional(),

    description: z.string().max(1000).trim().optional(),

    mediaType: z.enum(['IMAGE', 'VIDEO']).optional(),

    category: z.string().min(1).max(100).trim().optional(),

    featured: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === 'boolean') return val;
        if (val === 'true') return true;
        if (val === 'false') return false;
        return undefined;
      }),

    videoUrl: z.string().url('Invalid video URL').optional(),

    imageUrl: z.string().url('Invalid image URL').optional(),
  }),

  params: z.object({
    id: z.string().min(1, 'Gallery ID is required'),
  }),
};

export const galleryIdParamSchema = {
  params: z.object({
    id: z.string().min(1, 'Gallery ID is required'),
  }),
};

export const galleryQuerySchema = {
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
    mediaType: z.enum(['IMAGE', 'VIDEO']).optional(),
  }),
};

export type CreateGalleryInput = z.infer<typeof createGallerySchema.body>;
export type UpdateGalleryInput = z.infer<typeof updateGallerySchema.body>;
export type GalleryQuery = z.infer<typeof galleryQuerySchema.query>;
