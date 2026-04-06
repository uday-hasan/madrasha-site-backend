import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/database';

// ================================
// GALLERY TESTS
// We mock Prisma so tests don't need a real database.
// ================================

vi.mock('../../config/database', () => ({
  prisma: {
    gallery: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const mockPrisma = prisma as unknown as {
  gallery: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

const sampleGallery = {
  id: 'gallery-1',
  title: 'Test Gallery',
  description: 'A test gallery item',
  imageUrl: '/uploads/images/test.jpg',
  videoUrl: null,
  mediaType: 'IMAGE',
  category: 'general',
  featured: false,
  uploadedBy: 'user-1',
  uploader: { id: 'user-1', name: 'Admin' },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Gallery Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---- GET ALL ----
  describe('GET /api/v1/gallery', () => {
    it('should return a list of gallery items', async () => {
      mockPrisma.gallery.findMany.mockResolvedValue([sampleGallery]);
      mockPrisma.gallery.count.mockResolvedValue(1);
      mockPrisma.$transaction.mockImplementation((promises: Promise<unknown>[]) =>
        Promise.all(promises),
      );

      const res = await request(app).get('/api/v1/gallery');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should support featured filter', async () => {
      mockPrisma.gallery.findMany.mockResolvedValue([]);
      mockPrisma.gallery.count.mockResolvedValue(0);
      mockPrisma.$transaction.mockImplementation((promises: Promise<unknown>[]) =>
        Promise.all(promises),
      );

      const res = await request(app).get('/api/v1/gallery?featured=true');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ---- GET BY ID ----
  describe('GET /api/v1/gallery/:id', () => {
    it('should return a gallery item by ID', async () => {
      mockPrisma.gallery.findUnique.mockResolvedValue(sampleGallery);

      const res = await request(app).get('/api/v1/gallery/gallery-1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('gallery-1');
    });

    it('should return 404 if gallery item not found', async () => {
      mockPrisma.gallery.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/v1/gallery/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ---- CREATE (admin only) ----
  describe('POST /api/v1/gallery', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/gallery')
        .field('title', 'New Gallery')
        .field('mediaType', 'IMAGE');

      expect(res.status).toBe(401);
    });
  });

  // ---- DELETE (admin only) ----
  describe('DELETE /api/v1/gallery/:id', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app).delete('/api/v1/gallery/gallery-1');

      expect(res.status).toBe(401);
    });
  });
});
