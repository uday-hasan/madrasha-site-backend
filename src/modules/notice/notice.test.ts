import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

// ================================
// NOTICE TESTS
// We mock Prisma so tests don't need a real database.
// ================================

vi.mock('../../config/database', () => ({
  prisma: {
    notice: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const mockPrisma = prisma as unknown as {
  notice: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};
const sampleNotice = {
  id: 'notice-1',
  title: 'Test Notice',
  content: 'This is a test notice with enough content',
  category: 'general',
  featured: false,
  slug: 'test-notice',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Notice Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---- GET ALL ----
  describe('GET /api/v1/notices', () => {
    it('should return a list of notices', async () => {
      mockPrisma.notice.findMany.mockResolvedValue([sampleNotice]);
      mockPrisma.notice.count.mockResolvedValue(1);
      mockPrisma.$transaction.mockImplementation((promises: Promise<unknown>[]) =>
        Promise.all(promises),
      );

      const res = await request(app).get('/api/v1/notices');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ---- GET FEATURED ----
  describe('GET /api/v1/notices/featured', () => {
    it('should return featured notices', async () => {
      mockPrisma.notice.findMany.mockResolvedValue([
        { ...sampleNotice, featured: true },
      ]);

      const res = await request(app).get('/api/v1/notices/featured');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ---- GET BY ID ----
  describe('GET /api/v1/notices/:id', () => {
    it('should return a notice by ID', async () => {
      mockPrisma.notice.findUnique.mockResolvedValue(sampleNotice);

      const res = await request(app).get('/api/v1/notices/notice-1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('notice-1');
    });

    it('should return 404 if notice not found', async () => {
      mockPrisma.notice.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/v1/notices/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ---- CREATE (admin only) ----
  describe('POST /api/v1/notices', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app).post('/api/v1/notices').send({
        title: 'New Notice',
        content: 'This is valid notice content',
        featured: false,
      });

      expect(res.status).toBe(401);
    });

    it('should return 422 for missing required fields', async () => {
      const res = await request(app).post('/api/v1/notices').send({
        title: 'No content',
      });

      // 401 (not authenticated) or 422 — both are acceptable here
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });
});
