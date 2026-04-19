import { Request, Response } from 'express';
import { homeService } from './home.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getFullFileUrl, deleteFile } from '../../utils/fileUpload';
import path from 'path';

// ================================
// HOME CONTROLLER
// ================================

export const homeController = {
  // GET /home
  get: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const data = await homeService.getHomeData();

    sendResponse(res, {
      statusCode: 200,
      message: 'হোম পেজ ডেটা সফলভাবে লোড হয়েছে',
      data,
    });
  }),

  // Upload hero slide image
  uploadImage: catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      sendResponse(res, {
        statusCode: 400,
        message: 'কোনো ছবি আপলোড করা হয়নি',
      });
      return;
    }

    const imageUrl = getFullFileUrl(req.file);
    sendResponse(res, {
      statusCode: 200,
      message: 'ছবি সফলভাবে আপলোড হয়েছে',
      data: { imageUrl },
    });
  }),

  // PUT /home/slides
  updateSlides: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await homeService.updateSlides(req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'হিরো স্লাইড সফলভাবে আপডেট হয়েছে',
      data: { heroSlides: data.heroSlides },
    });
  }),

  // GET /home/stats
  getStats: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const data = await homeService.getStats();

    sendResponse(res, {
      statusCode: 200,
      message: 'পরিসংখ্যান সফলভাবে লোড হয়েছে',
      data,
    });
  }),

  // PUT /home/stats
  updateStats: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await homeService.updateStats(req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'পরিসংখ্যান সফলভাবে আপডেট হয়েছে',
      data: { stats: data.stats },
    });
  }),

  // GET /home/slides
  getSlides: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const data = await homeService.getSlides();

    sendResponse(res, {
      statusCode: 200,
      message: 'হিরো স্লাইড সফলভাবে লোড হয়েছে',
      data,
    });
  }),

  // ---- OLD METHODS (for backward compatibility) ----
  // PUT /home (deprecated but kept for now)
  update: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    // This endpoint no longer does anything useful but kept for backward compatibility
    const data = await homeService.getHomeData();
    sendResponse(res, {
      statusCode: 200,
      message: 'হোম পেজ ডেটা লোড হয়েছে',
      data,
    });
  }),
  upsertSlide: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await homeService.upsertSlide(req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'হোম পেজ সফলভাবে আপডেট হয়েছে',
      data,
    });
  }),
  deleteSlide: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await homeService.deleteSlide(req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'হোম পেজ সফলভাবে আপডেট হয়েছে',
      data,
    });
  }),

  // DELETE /home/image - Delete an uploaded image
  deleteImage: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      sendResponse(res, {
        statusCode: 400,
        message: 'ছবির URL প্রয়োজন',
      });
      return;
    }

    // Only delete if it's an uploaded image (not an external URL)
    if (imageUrl.startsWith('/uploads/')) {
      // Convert URL to file path
      const filePath = path.join(process.cwd(), imageUrl);
      deleteFile(filePath);
    }

    sendResponse(res, {
      statusCode: 200,
      message: 'ছবি সফলভাবে মুছে ফেলা হয়েছে',
    });
  }),
};
