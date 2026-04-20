import { prisma } from '../../config/database';
import { deleteFile, getFullUrl, urlToFilePath } from '../../utils/fileUpload';
import type { UpdateHomeInput } from './home.validation';

// ================================
// HOME SERVICE
// ================================

export const homeService = {
  // ---- GET HOME PAGE DATA (Public) ----
  // Returns heroSlides, stats, featured notices, and gallery items.
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

    // Ensure all hero slide image URLs have base URL
    const heroSlidesWithFullUrls = (homePage.heroSlides as any[]).map((slide: any) => ({
      ...slide,
      imageUrl: slide.imageUrl ? getFullUrl(slide.imageUrl) : slide.imageUrl,
    }));

    // Fetch featured notices for the home page news section (limit to 3)
    let featuredNotices: any[] = [];
    try {
      featuredNotices = await prisma.notice.findMany({
        where: { featured: true, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          category: true,
          slug: true,
          attachmentUrl: true,
          createdAt: true,
        },
      });
    } catch (error) {
      console.error('Error fetching featured notices:', error);
      featuredNotices = [];
    }

    // Fetch latest gallery items for preview (limit to 3 featured items only)
    const latestGalleryRaw = await prisma.gallery.findMany({
      where: { featured: true, mediaType: 'IMAGE' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        imageUrl: true,
        videoUrl: true,
        mediaType: true,
        category: true,
        description: true,
      },
    });

    // Add full URLs to gallery items
    const latestGallery = latestGalleryRaw.map((item: any) => ({
      ...item,
      imageUrl: item.imageUrl ? getFullUrl(item.imageUrl) : item.imageUrl,
      videoUrl: item.videoUrl ? getFullUrl(item.videoUrl) : item.videoUrl,
    }));

    // Fetch active departments
    const activeDepartments = await prisma.department.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 4,
    });

    return {
      heroSlides: heroSlidesWithFullUrls,
      stats: homePage.stats,
      featuredNotices,
      latestGallery,
      activeDepartments,
    };
  },

  // ---- GET HERO SLIDES (Admin only) ----
  async getSlides() {
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

    const heroSlidesWithFullUrls = (homePage.heroSlides as any[]).map((slide: any) => ({
      ...slide,
      imageUrl: slide.imageUrl ? getFullUrl(slide.imageUrl) : slide.imageUrl,
    }));

    return { heroSlides: heroSlidesWithFullUrls };
  },

  // ---- UPDATE HERO SLIDES (Admin only) ----
  async updateSlides(data: UpdateHomeInput) {
    const existing = await prisma.homePage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return prisma.homePage.update({
        where: { id: existing.id },
        data: {
          ...(data.heroSlides !== undefined && { heroSlides: data.heroSlides }),
        },
      });
    }

    return prisma.homePage.create({
      data: {
        heroSlides: data.heroSlides ?? [],
        stats: [],
      },
    });
  },

  // ---- GET STATISTICS (Admin only) ----
  async getStats() {
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

    return { stats: homePage.stats };
  },

  // ---- UPDATE STATISTICS (Admin only) ----
  async updateStats(data: UpdateHomeInput) {
    const existing = await prisma.homePage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return prisma.homePage.update({
        where: { id: existing.id },
        data: {
          ...(data.stats !== undefined && { stats: data.stats }),
        },
      });
    }

    return prisma.homePage.create({
      data: {
        heroSlides: [],
        stats: data.stats ?? [],
      },
    });
  },
  async upsertSlide(data: any, file?: Express.Multer.File) {
    const homePage = await prisma.homePage.findFirst({ orderBy: { createdAt: 'desc' } });
    if (!homePage) throw new Error('Home page record not found');

    const heroSlides = (homePage.heroSlides as any[]) || [];
    const slideId = data.id; // Existing ID if updating

    const targetIndex = slideId ? heroSlides.findIndex((s) => s.id === slideId) : -1;
    let imageUrl = data.imageUrl; // Keep old URL if no new file

    if (file) {
      // If updating, delete the old file first
      if (targetIndex !== -1 && heroSlides[targetIndex].imageUrl) {
        const oldPath = urlToFilePath(heroSlides[targetIndex].imageUrl);
        if (oldPath) deleteFile(oldPath);
      }
      imageUrl = getFullUrl(`/uploads/images/${file.filename}`);
    }

    const newSlideData = {
      id: slideId || `slide_${Date.now()}`,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      imageUrl: imageUrl || '',
    };

    if (targetIndex !== -1) {
      heroSlides[targetIndex] = newSlideData;
    } else {
      heroSlides.push(newSlideData);
    }

    return await prisma.homePage.update({
      where: { id: homePage.id },
      data: { heroSlides },
    });
  },

  async deleteSlide(slideId: string) {
    const homePage = await prisma.homePage.findFirst({ orderBy: { createdAt: 'desc' } });
    if (!homePage) return;

    const heroSlides = (homePage.heroSlides as any[]) || [];
    const slideToDelete = heroSlides.find((s) => s.id === slideId);

    if (slideToDelete?.imageUrl) {
      const path = urlToFilePath(slideToDelete.imageUrl);
      if (path) deleteFile(path);
    }

    const updatedSlides = heroSlides.filter((s) => s.id !== slideId);
    return await prisma.homePage.update({
      where: { id: homePage.id },
      data: { heroSlides: updatedSlides },
    });
  },
};
