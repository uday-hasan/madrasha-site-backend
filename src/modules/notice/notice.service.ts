import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import { getPaginationParams } from '../../utils/pagination';
import { slugify, generateUniqueSlug } from '../../utils/helpers';
import type { CreateNoticeInput, UpdateNoticeInput, NoticeQuery } from './notice.validation';

// ================================
// NOTICE SERVICE
// ================================

export const noticeService = {
  // ---- GET ALL ----
  async getAllNotices(query: NoticeQuery) {
    const { page, limit, featured, isActive, isImportant, category, search } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where = {
      ...(featured !== undefined && { featured }),
      ...(isActive !== undefined && { isActive }),
      ...(isImportant !== undefined && { isImportant }),
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [notices, total] = await prisma.$transaction([
      prisma.notice.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notice.count({ where }),
    ]);

    return {
      data: notices,
      meta: {
        page: page ?? 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  },

  // ---- GET FEATURED (for home marquee) ----
  async getFeaturedNotices() {
    return prisma.notice.findMany({
      where: { featured: true, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  },

  // ---- GET IMPORTANT (for marquee notice) ----
  async getImportantNotices() {
    return prisma.notice.findMany({
      where: { isImportant: true, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  },

  // ---- GET ACTIVE (for public pages) ----
  async getActiveNotices(limit: number = 10) {
    return prisma.notice.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        featured: true,
        isImportant: true,
        slug: true,
        attachmentUrl: true,
        createdAt: true,
      },
    });
  },

  // ---- GET BY ID ----
  async getNoticeById(id: string) {
    const notice = await prisma.notice.findUnique({ where: { id } });

    if (!notice) {
      throw new AppError('Notice not found', 404);
    }

    return notice;
  },

  // ---- GET BY SLUG ----
  async getNoticeBySlug(slug: string) {
    const notice = await prisma.notice.findUnique({ where: { slug } });

    if (!notice) {
      throw new AppError('Notice not found', 404);
    }

    return notice;
  },

  // ---- CREATE ----
  async createNotice(data: CreateNoticeInput) {
    const {
      title,
      content,
      excerpt,
      category,
      featured,
      isActive,
      isImportant,
      attachmentUrl,
      slug,
    } = data;

    // Generate slug if not provided
    let finalSlug = slug ? slugify(slug) : generateUniqueSlug(title);

    // Ensure slug is unique
    const existing = await prisma.notice.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = generateUniqueSlug(title);
    }

    return prisma.notice.create({
      data: {
        title,
        content,
        excerpt,
        category: category ?? 'general',
        featured: featured ?? false,
        isActive: isActive ?? true,
        isImportant: isImportant ?? false,
        attachmentUrl,
        slug: finalSlug,
      },
    });
  },

  // ---- UPDATE ----
  async updateNotice(id: string, data: UpdateNoticeInput) {
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Notice not found', 404);
    }

    // Handle slug update
    let finalSlug = existing.slug;
    if (data.slug) {
      const newSlug = slugify(data.slug);
      // Check if new slug is already taken by another notice
      const slugExists = await prisma.notice.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });
      if (slugExists) {
        throw new AppError('A notice with this slug already exists', 409);
      }
      finalSlug = newSlug;
    }

    return prisma.notice.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isImportant !== undefined && { isImportant: data.isImportant }),
        ...(data.attachmentUrl !== undefined && { attachmentUrl: data.attachmentUrl }),
        slug: finalSlug,
      },
    });
  },

  // ---- DELETE ----
  async deleteNotice(id: string) {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      throw new AppError('Notice not found', 404);
    }

    await prisma.notice.delete({ where: { id } });
  },
};
