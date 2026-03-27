// ================================
// SHARED TYPES
// Reusable types used across modules.
// ================================

// Pagination query params (used by list endpoints)
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Pagination meta (included in list responses)
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Generic paginated result
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// Calculate skip value for Prisma queries
export const getPaginationParams = (
  page = 1,
  limit = 10,
): { skip: number; take: number; page: number; limit: number } => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit)); // Max 100 items per page
  const skip = (safePage - 1) * safeLimit;

  return { skip, take: safeLimit, page: safePage, limit: safeLimit };
};
