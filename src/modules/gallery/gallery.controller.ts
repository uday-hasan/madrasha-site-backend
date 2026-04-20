import { Request, Response } from 'express';
import { galleryService } from './gallery.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';
import type { CreateGalleryInput, UpdateGalleryInput, GalleryQuery } from './gallery.validation';

// ================================
// GALLERY CONTROLLER
// ================================

export const galleryController = {
  // GET /gallery
  getAll: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await galleryService.getAllGalleries(req.query as unknown as GalleryQuery);

    sendResponse(res, {
      statusCode: 200,
      message: 'Galleries fetched successfully',
      data: result.data,
      meta: result.meta,
    });
  }),

  // GET /gallery/:id
  getById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const gallery = await galleryService.getGalleryById(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'Gallery item fetched successfully',
      data: gallery,
    });
  }),

  // POST /gallery
  create: catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Validate file size based on media type
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video/');
      const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB video, 5MB image
      const maxSizeLabel = isVideo ? '10MB' : '5MB';

      if (req.file.size > maxSize) {
        throw new AppError(
          `File too large. Maximum size allowed for ${isVideo ? 'videos' : 'images'} is ${maxSizeLabel}.`,
          413,
        );
      }
    }

    const gallery = await galleryService.createGallery(
      req.body as CreateGalleryInput,
      req.user!.userId,
      req.file,
      req,
    );

    sendResponse(res, {
      statusCode: 201,
      message: 'Gallery item created successfully',
      data: gallery,
    });
  }),

  // PUT /gallery/:id
  update: catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Validate file size based on media type
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video/');
      const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB video, 5MB image
      const maxSizeLabel = isVideo ? '10MB' : '5MB';

      if (req.file.size > maxSize) {
        throw new AppError(
          `File too large. Maximum size allowed for ${isVideo ? 'videos' : 'images'} is ${maxSizeLabel}.`,
          413,
        );
      }
    }

    const gallery = await galleryService.updateGallery(
      req.params.id as string,
      req.body as UpdateGalleryInput,
      req.file,
      req,
    );

    sendResponse(res, {
      statusCode: 200,
      message: 'Gallery item updated successfully',
      data: gallery,
    });
  }),

  // DELETE /gallery/:id
  delete: catchAsync(async (req: Request, res: Response): Promise<void> => {
    await galleryService.deleteGallery(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'Gallery item deleted successfully',
    });
  }),
};
