import { Request, Response } from 'express';
import { homeService } from './home.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import type { UpdateHomeInput } from './home.validation';

// ================================
// HOME CONTROLLER
// ================================

export const homeController = {
  // GET /home
  get: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const data = await homeService.getHomeData();

    sendResponse(res, {
      statusCode: 200,
      message: 'Home data fetched successfully',
      data,
    });
  }),

  // PUT /home
  update: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await homeService.updateHomeData(req.body as UpdateHomeInput);

    sendResponse(res, {
      statusCode: 200,
      message: 'Home content updated successfully',
      data,
    });
  }),
};
