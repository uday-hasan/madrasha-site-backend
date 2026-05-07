import { Request, Response } from 'express';
import { donationService } from './donation.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export const donationController = {
  // Get donation page data (Public)
  getDonationData: catchAsync(async (_req: Request, res: Response) => {
    const data = await donationService.getDonationData();
    sendResponse(res, {
      statusCode: 200,
      message: 'দান পৃষ্ঠার ডেটা পাওয়া গেছে',
      data,
    });
  }),

  // Update donation data (Admin only)
  updateDonationData: catchAsync(async (req: Request, res: Response) => {
    const data = await donationService.updateDonationData(req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'দান ডেটা আপডেট করা হয়েছে',
      data,
    });
  }),
};
