import { prisma } from '../../config/database';
import { getFullUrl } from '../../utils/fileUpload';
import type { UpdateHomeInput } from './home.validation';

// ================================
// HOME SERVICE
// ================================

export const homeService = {
  // ---- GET HOME PAGE DATA ----
  // Returns heroSlides, stats, featured notices, latest notices, and gallery items.
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

    // Fetch featured notices for the home page news section
    const featuredNoticesLimit = homePage.featuredNoticesLimit || 3;
    let featuredNotices: any[] = [];
    try {
      featuredNotices = await prisma.notice.findMany({
        where: { featured: true, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: featuredNoticesLimit,
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
      // If there's an error fetching notices, just use empty array
      featuredNotices = [];
    }

    // Fetch latest gallery items for preview
    const galleryPreviewLimit = homePage.galleryPreviewLimit || 3;
    const latestGalleryRaw = await prisma.gallery.findMany({
      where: { mediaType: 'IMAGE' },
      orderBy: { createdAt: 'desc' },
      take: galleryPreviewLimit,
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
      bannerImage: homePage.bannerImage,
      marqueeText: homePage.marqueeText,
      aboutSummary: homePage.aboutSummary,
      featuredNoticesLimit: homePage.featuredNoticesLimit,
      galleryPreviewLimit: homePage.galleryPreviewLimit,
      featuredNotices,
      latestGallery,
      activeDepartments,
    };
  },

  // ---- UPDATE HOME PAGE CONTENT (Admin only) ----
  async updateHomeData(data: UpdateHomeInput) {
    // Get existing record or create one
    const existing = await prisma.homePage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const updateData: any = {
      ...(data.heroSlides !== undefined && { heroSlides: data.heroSlides }),
      ...(data.stats !== undefined && { stats: data.stats }),
      ...(data.bannerImage !== undefined && { bannerImage: data.bannerImage }),
      ...(data.marqueeText !== undefined && { marqueeText: data.marqueeText }),
      ...(data.aboutSummary !== undefined && { aboutSummary: data.aboutSummary }),
      ...(data.featuredNoticesLimit !== undefined && {
        featuredNoticesLimit: data.featuredNoticesLimit,
      }),
      ...(data.galleryPreviewLimit !== undefined && {
        galleryPreviewLimit: data.galleryPreviewLimit,
      }),
    };

    if (existing) {
      return prisma.homePage.update({
        where: { id: existing.id },
        data: updateData,
      });
    }

    return prisma.homePage.create({
      data: {
        heroSlides: data.heroSlides ?? [],
        stats: data.stats ?? [],
        bannerImage: data.bannerImage,
        marqueeText: data.marqueeText,
        aboutSummary: data.aboutSummary,
        featuredNoticesLimit: data.featuredNoticesLimit ?? 3,
        galleryPreviewLimit: data.galleryPreviewLimit ?? 3,
      },
    });
  },
};
