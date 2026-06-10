import { z } from 'zod';

// ================================
// HOME VALIDATION SCHEMAS
// ================================

const heroSlideSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().max(200).trim().optional(),
  subtitle: z.string().max(200).trim().optional(),
  description: z.string().max(1000).trim().optional(),
  imageUrl: z.string().min(1).trim(),
  ctaText: z.string().max(100).trim().optional(),
  ctaLink: z.string().max(200).trim().optional(),
});

const statSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  label: z.string().min(1).max(100).trim(),
  value: z.union([z.string(), z.number()]).transform((val) => String(val)),
  suffix: z.string().max(20).trim().optional(),
  icon: z.string().max(50).trim().optional(),
});

const aboutValueSchema = z.object({
  icon: z.string().trim().optional(),
  title: z.string().trim().min(1),
  desc: z.string().trim().min(1),
});

const aboutSummarySchema = z.object({
  title: z.string().trim().min(1),
  text1: z.string().trim().optional(),
  text2: z.string().trim().optional(),
  values: z.array(aboutValueSchema).optional(),
});

export const updateHomeSchema = {
  body: z.object({
    heroSlides: z.array(heroSlideSchema).optional(),
    stats: z.array(statSchema).optional(),
    aboutSummary: aboutSummarySchema.optional(),
  }),
};

export type HeroSlide = z.infer<typeof heroSlideSchema>;
export type Stat = z.infer<typeof statSchema>;
export type UpdateHomeInput = z.infer<typeof updateHomeSchema.body>;
