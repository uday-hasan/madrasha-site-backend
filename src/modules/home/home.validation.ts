import { z } from 'zod';

// ================================
// HOME VALIDATION SCHEMAS
// ================================

const heroSlideSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  subtitle: z.string().max(200).trim().optional(),
  description: z.string().max(1000).trim().optional(),
  imageUrl: z.string().min(1).trim(),
});

const statSchema = z.object({
  label: z.string().min(1).max(100).trim(),
  value: z.string().min(1).max(50).trim(),
  suffix: z.string().max(20).trim().optional(),
  icon: z.string().max(50).trim().optional(),
});

export const updateHomeSchema = {
  body: z.object({
    heroSlides: z.array(heroSlideSchema).optional(),
    stats: z.array(statSchema).optional(),
  }),
};

export type HeroSlide = z.infer<typeof heroSlideSchema>;
export type Stat = z.infer<typeof statSchema>;
export type UpdateHomeInput = z.infer<typeof updateHomeSchema.body>;
