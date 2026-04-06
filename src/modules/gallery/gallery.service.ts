import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import { getPaginationParams } from '../../utils/pagination';
import { deleteFile, urlToFilePath } from '../../utils/fileUpload';
import type { CreateGalleryInput, UpdateGalleryInput, GalleryQuery } from './gallery.validation';
import { MediaType } from '@/generated/prisma/enums';

// ================================
// GALLERY SERVICE
// ================================

export const galleryService = {
  // ---- GET ALL ----
  async getAllGalleries(query: GalleryQuery) {
    const { page, limit, featured, category, mediaType } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where = {
      ...(featured !== undefined && { featured }),
      ...(category && { category }),
      ...(mediaType && { mediaType: mediaType as MediaType }),
    };

    const [galleries, total] = await prisma.$transaction([
      prisma.gallery.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          uploader: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.gallery.count({ where }),
    ]);

    return {
      data: galleries,
      meta: {
        page: page ?? 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  },

  // ---- GET BY ID ----
  async getGalleryById(id: string) {
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: {
        uploader: { select: { id: true, name: true } },
      },
    });

    if (!gallery) {
      throw new AppError('Gallery item not found', 404);
    }

    return gallery;
  },

  // ---- CREATE ----
  async createGallery(
    data: CreateGalleryInput,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const { title, description, mediaType, category, featured, videoUrl } = data;

    // For IMAGE type, a file must be provided (unless videoUrl given)
    let imageUrl: string | undefined;
    let finalVideoUrl: string | undefined;

    if (mediaType === 'VIDEO' && videoUrl) {
      finalVideoUrl = videoUrl;
    } else if (file) {
      if (mediaType === 'VIDEO') {
        finalVideoUrl = `/uploads/videos/${file.filename}`;
      } else {
        imageUrl = `/uploads/images/${file.filename}`;
      }
    } else if (mediaType === 'IMAGE') {
      throw new AppError('An image file is required for IMAGE type gallery items', 400);
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        description,
        imageUrl,
        videoUrl: finalVideoUrl,
        mediaType: mediaType as MediaType,
        category: category ?? 'general',
        featured: featured ?? false,
        uploadedBy: userId,
      },
      include: {
        uploader: { select: { id: true, name: true } },
      },
    });

    return gallery;
  },

  // ---- UPDATE ----
  async updateGallery(
    id: string,
    data: UpdateGalleryInput,
    file?: Express.Multer.File,
  ) {
    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Gallery item not found', 404);
    }

    let imageUrl = existing.imageUrl ?? undefined;
    let videoUrl = data.videoUrl ?? existing.videoUrl ?? undefined;

    // If a new file is uploaded, delete the old one and update the path
    if (file) {
      if (data.mediaType === 'VIDEO' || existing.mediaType === 'VIDEO') {
        if (existing.videoUrl && !existing.videoUrl.startsWith('http')) {
          deleteFile(urlToFilePath(existing.videoUrl));
        }
        videoUrl = `/uploads/videos/${file.filename}`;
      } else {
        if (existing.imageUrl) {
          deleteFile(urlToFilePath(existing.imageUrl));
        }
        imageUrl = `/uploads/images/${file.filename}`;
      }
    }

    const gallery = await prisma.gallery.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.mediaType !== undefined && { mediaType: data.mediaType as MediaType }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.featured !== undefined && { featured: data.featured }),
        imageUrl,
        videoUrl,
      },
      include: {
        uploader: { select: { id: true, name: true } },
      },
    });

    return gallery;
  },

  // ---- DELETE ----
  async deleteGallery(id: string) {
    const gallery = await prisma.gallery.findUnique({ where: { id } });
    if (!gallery) {
      throw new AppError('Gallery item not found', 404);
    }

    // Delete associated files
    if (gallery.imageUrl) {
      deleteFile(urlToFilePath(gallery.imageUrl));
    }
    if (gallery.videoUrl && !gallery.videoUrl.startsWith('http')) {
      deleteFile(urlToFilePath(gallery.videoUrl));
    }

    await prisma.gallery.delete({ where: { id } });
  },
};
