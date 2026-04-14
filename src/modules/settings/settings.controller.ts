import { Request, Response } from 'express';
import { settingsService } from './settings.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export const settingsController = {
  // Get all settings (Admin only)
  getAll: catchAsync(async (_req: Request, res: Response) => {
    const result = await settingsService.getAll();
    sendResponse(res, {
      statusCode: 200,
      message: 'সেটিংস সফলভাবে লোড হয়েছে',
      data: result,
    });
  }),

  // Get public settings (no auth required)
  getPublic: catchAsync(async (_req: Request, res: Response) => {
    const result = await settingsService.getPublic();
    sendResponse(res, {
      statusCode: 200,
      message: 'সেটিংস সফলভাবে লোড হয়েছে',
      data: result,
    });
  }),

  // Get settings by category (public)
  getByCategory: catchAsync(async (req: Request, res: Response) => {
    const { category } = req.params;
    const result = await settingsService.getByCategory(category);
    sendResponse(res, {
      statusCode: 200,
      message: 'সেটিংস সফলভাবে লোড হয়েছে',
      data: result,
    });
  }),

  // Get setting by key (public)
  getByKey: catchAsync(async (req: Request, res: Response) => {
    const { key } = req.params;
    const result = await settingsService.getByKey(key);
    sendResponse(res, {
      statusCode: 200,
      message: 'সেটিং সফলভাবে লোড হয়েছে',
      data: result,
    });
  }),

  // Create setting (Admin only)
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await settingsService.create(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'সেটিং সফলভাবে তৈরি হয়েছে',
      data: result,
    });
  }),

  // Update setting (Admin only)
  update: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await settingsService.update(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'সেটিং সফলভাবে আপডেট হয়েছে',
      data: result,
    });
  }),

  // Delete setting (Admin only)
  delete: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await settingsService.delete(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'সেটিং সফলভাবে মুছে ফেলা হয়েছে',
    });
  }),
};
