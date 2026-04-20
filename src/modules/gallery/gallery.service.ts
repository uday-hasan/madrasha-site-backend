/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import { getPaginationParams } from '../../utils/pagination';
import { deleteFile, getFullUrl, urlToFilePath } from '../../utils/fileUpload';
import type { GalleryQuery } from './gallery.validation';
import { MediaType } from '@/generated/prisma/enums';

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
  async createGallery(data: any, userId: string, file?: Express.Multer.File, req?: any) {
    const {
      title,
      description,
      mediaType,
      category,
      videoUrl,
      imageUrl: inputImageUrl,
      featured,
    } = data;

    // Detect base URL from request if available
    let baseUrl = undefined;
    if (req) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      baseUrl = `${protocol}://${host}`;
    }

    let finalImageUrl: string | undefined;
    let finalVideoUrl: string | undefined;

    if (mediaType === 'VIDEO') {
      // If there's an external URL (YT/FB), use it. Otherwise, use the uploaded file.
      finalVideoUrl = videoUrl
        ? videoUrl
        : file
          ? getFullUrl(`/uploads/videos/${file.filename}`, baseUrl)
          : undefined;
    } else {
      // For IMAGE: use external link if provided, otherwise the file
      finalImageUrl = inputImageUrl
        ? inputImageUrl
        : file
          ? getFullUrl(`/uploads/images/${file.filename}`, baseUrl)
          : undefined;
    }

    if (!finalImageUrl && !finalVideoUrl) {
      throw new AppError('মিডিয়া ফাইল অথবা ইউআরএল আবশ্যক', 400);
    }

    return await prisma.gallery.create({
      data: {
        title,
        description,
        mediaType,
        category: category || 'General',
        imageUrl: finalImageUrl,
        videoUrl: finalVideoUrl,
        featured: featured ?? false,
        uploadedBy: userId,
      },
      include: { uploader: { select: { id: true, name: true } } },
    });
  },

  // ---- UPDATE ----
  async updateGallery(id: string, data: any, file?: Express.Multer.File, req?: any) {
    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing) throw new AppError('আইটেমটি পাওয়া যায়নি', 404);

    // Detect base URL from request if available
    let baseUrl = undefined;
    if (req) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      baseUrl = `${protocol}://${host}`;
    }

    let imageUrl = data.imageUrl || existing.imageUrl;
    let videoUrl = data.videoUrl || existing.videoUrl;

    if (file) {
      // Delete old local file if it exists
      const oldPath = urlToFilePath(existing.imageUrl || existing.videoUrl || '');
      if (oldPath) deleteFile(oldPath);

      // Save new file path as full URL
      const folder = data.mediaType === 'VIDEO' ? 'videos' : 'images';
      const newUrl = getFullUrl(`/uploads/${folder}/${file.filename}`, baseUrl);

      if (data.mediaType === 'VIDEO') {
        videoUrl = newUrl;
        imageUrl = null;
      } else {
        imageUrl = newUrl;
        videoUrl = null;
      }
    }

    return await prisma.gallery.update({
      where: { id },
      data: { ...data, imageUrl, videoUrl },
      include: { uploader: { select: { id: true, name: true } } },
    });
  },

  // ---- DELETE ----
  async deleteGallery(id: string) {
    const item = await prisma.gallery.findUnique({ where: { id } });
    if (!item) throw new AppError('আইটেমটি পাওয়া যায়নি', 404);

    // Try to delete local file for both image and video fields
    [item.imageUrl, item.videoUrl].forEach((url) => {
      if (url) {
        const filePath = urlToFilePath(url);
        if (filePath) deleteFile(filePath);
      }
    });

    await prisma.gallery.delete({ where: { id } });
  },
};
