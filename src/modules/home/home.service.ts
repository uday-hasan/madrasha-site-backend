import { prisma } from '../../config/database';
import type { UpdateHomeInput } from './home.validation';

// ================================
// HOME SERVICE
// ================================

export const homeService = {
  // ---- GET HOME PAGE DATA ----
  // Returns heroSlides, stats, featured notices, and featured gallery items.
  async getHomeData() {
    // Get (or create) the singleton HomePage record
    let homePage = await prisma.homePage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!homePage) {
      homePage = await prisma.homePage.create({
        data: {
          heroSlides: [],
          stats: [],
        },
      });
    }

    // Fetch featured notices for the marquee
    const featuredNotices = await prisma.notice.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, title: true, slug: true, createdAt: true },
    });

    // Fetch featured gallery items
    const featuredGallery = await prisma.gallery.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        videoUrl: true,
        mediaType: true,
        category: true,
      },
    });

    return {
      heroSlides: homePage.heroSlides,
      stats: homePage.stats,
      featuredNotices,
      featuredGallery,
    };
  },

  // ---- UPDATE HOME PAGE CONTENT (Admin only) ----
  async updateHomeData(data: UpdateHomeInput) {
    // Get existing record or create one
    const existing = await prisma.homePage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return prisma.homePage.update({
        where: { id: existing.id },
        data: {
          ...(data.heroSlides !== undefined && { heroSlides: data.heroSlides }),
          ...(data.stats !== undefined && { stats: data.stats }),
        },
      });
    }

    return prisma.homePage.create({
      data: {
        heroSlides: data.heroSlides ?? [],
        stats: data.stats ?? [],
      },
    });
  },
};
