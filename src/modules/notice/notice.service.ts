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
    const { page, limit, featured, category, search } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where = {
      ...(featured !== undefined && { featured }),
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
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
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

  // ---- CREATE ----
  async createNotice(data: CreateNoticeInput) {
    const { title, content, category, featured, slug } = data;

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
        category: category ?? 'general',
        featured: featured ?? false,
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
        ...(data.category !== undefined && { category: data.category }),
        ...(data.featured !== undefined && { featured: data.featured }),
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
