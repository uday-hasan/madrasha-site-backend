import { Request, Response } from 'express';
import { contactService } from './contact.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export const contactController = {
  // Get contact page data (Public)
  getContactData: catchAsync(async (_req: Request, res: Response) => {
    const data = await contactService.getContactData();
    sendResponse(res, {
      statusCode: 200,
      message: 'যোগাযোগ পৃষ্ঠার ডেটা পাওয়া গেছে',
      data,
    });
  }),

  // Update contact data (Admin only)
  updateContactData: catchAsync(async (req: Request, res: Response) => {
    const data = await contactService.updateContactData(req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'যোগাযোগ ডেটা আপডেট করা হয়েছে',
      data,
    });
  }),

  // Submit contact form (Public)
  submitContactForm: catchAsync(async (req: Request, res: Response) => {
    const { name, email, subject } = req.body;

    sendResponse(res, {
      statusCode: 200,
      message: 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে',
      data: { name, email, subject },
    });
  }),
};
