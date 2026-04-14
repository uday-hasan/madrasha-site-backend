import { Request, Response } from 'express';
import { homeService } from './home.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getFileUrl } from '../../utils/fileUpload';

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

    const imageUrl = getFileUrl(req.file);
    sendResponse(res, {
      statusCode: 200,
      message: 'ছবি সফলভাবে আপলোড হয়েছে',
      data: { imageUrl },
    });
  }),

  // PUT /home
  update: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await homeService.updateHomeData(req.body);

    sendResponse(res, {
      statusCode: 200,
      message: 'হোম পেজ সফলভাবে আপডেট হয়েছে',
      data,
    });
  }),
};
