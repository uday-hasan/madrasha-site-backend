import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

// ================================
// HOME TESTS
// We mock Prisma so tests don't need a real database.
// ================================

vi.mock('../../config/database', () => ({
  prisma: {
    homePage: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    notice: {
      findMany: vi.fn(),
    },
    gallery: {
      findMany: vi.fn(),
    },
  },
}));

const mockPrisma = prisma as unknown as {
  homePage: {
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  notice: { findMany: ReturnType<typeof vi.fn> };
  gallery: { findMany: ReturnType<typeof vi.fn> };
};

describe('Home Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---- GET HOME DATA ----
  describe('GET /api/v1/home', () => {
    it('should return home page data', async () => {
      mockPrisma.homePage.findFirst.mockResolvedValue({
        id: 'home-1',
        heroSlides: [],
        stats: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockPrisma.notice.findMany.mockResolvedValue([]);
      mockPrisma.gallery.findMany.mockResolvedValue([]);

      const res = await request(app).get('/api/v1/home');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('heroSlides');
      expect(res.body.data).toHaveProperty('stats');
      expect(res.body.data).toHaveProperty('featuredNotices');
      expect(res.body.data).toHaveProperty('featuredGallery');
    });

    it('should create home page if it does not exist', async () => {
      mockPrisma.homePage.findFirst.mockResolvedValue(null);
      mockPrisma.homePage.create.mockResolvedValue({
        id: 'home-1',
        heroSlides: [],
        stats: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockPrisma.notice.findMany.mockResolvedValue([]);
      mockPrisma.gallery.findMany.mockResolvedValue([]);

      const res = await request(app).get('/api/v1/home');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ---- UPDATE HOME DATA (admin only) ----
  describe('PUT /api/v1/home', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app).put('/api/v1/home').send({
        heroSlides: [],
        stats: [],
      });

      expect(res.status).toBe(401);
    });
  });
});
