import { Request, Response } from 'express';
import { teacherService } from './teacher.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export const teacherController = {
  // Get all active teachers (public)
  getAllActive: catchAsync(async (_req: Request, res: Response) => {
    const result = await teacherService.getAllActive();
    sendResponse(res, {
      statusCode: 200,
      message: 'শিক্ষকদের তালিকা সফলভাবে লোড হয়েছে',
      data: result,
    });
  }),

  // Get all teachers (admin)
  getAll: catchAsync(async (_req: Request, res: Response) => {
    const result = await teacherService.getAll();
    sendResponse(res, {
      statusCode: 200,
      message: 'সব শিক্ষকের তালিকা লোড হয়েছে',
      data: result,
    });
  }),

  // Get teacher by id
  getById: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await teacherService.getById(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'শিক্ষকের তথ্য লোড হয়েছে',
      data: result,
    });
  }),

  // Create teacher (admin)
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await teacherService.create(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'শিক্ষক সফলভাবে যোগ করা হয়েছে',
      data: result,
    });
  }),

  // Update teacher (admin)
  update: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await teacherService.update(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'শিক্ষকের তথ্য আপডেট হয়েছে',
      data: result,
    });
  }),

  // Delete teacher (admin)
  delete: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await teacherService.delete(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'শিক্ষক মুছে ফেলা হয়েছে',
    });
  }),
};
