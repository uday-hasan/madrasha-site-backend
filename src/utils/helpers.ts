// ================================
// HELPER UTILITIES
// Shared utility functions used across modules.
// ================================

/**
 * Convert a string to a URL-friendly slug.
 * e.g. "Hello World! 123" → "hello-world-123"
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove non-word chars (except -)
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

/**
 * Generate a unique slug by appending a timestamp if needed.
 */
export const generateUniqueSlug = (title: string): string => {
  const base = slugify(title);
  const timestamp = Date.now().toString(36);
  return `${base}-${timestamp}`;
};

/**
 * Format a date to Bengali locale string.
 */
export const formatDateBengali = (date: Date): string => {
  return date.toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Strip undefined values from an object (useful for Prisma update payloads).
 */
export const stripUndefined = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> => {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
};
