import { Request, Response } from 'express';
import { noticeService } from './notice.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import type { CreateNoticeInput, UpdateNoticeInput, NoticeQuery } from './notice.validation';

// ================================
// NOTICE CONTROLLER
// ================================

export const noticeController = {
  // GET /notices
  getAll: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await noticeService.getAllNotices(req.query as unknown as NoticeQuery);

    sendResponse(res, {
      statusCode: 200,
      message: 'Notices fetched successfully',
      data: result.data,
      meta: result.meta,
    });
  }),

  // GET /notices/featured
  getFeatured: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const notices = await noticeService.getFeaturedNotices();

    sendResponse(res, {
      statusCode: 200,
      message: 'Featured notices fetched successfully',
      data: notices,
    });
  }),

  // GET /notices/important
  getImportant: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const notices = await noticeService.getImportantNotices();

    sendResponse(res, {
      statusCode: 200,
      message: 'Important notices fetched successfully',
      data: notices,
    });
  }),

  // GET /notices/active
  getActive: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const notices = await noticeService.getActiveNotices(limit);

    sendResponse(res, {
      statusCode: 200,
      message: 'Active notices fetched successfully',
      data: notices,
    });
  }),

  // GET /notices/slug/:slug
  getBySlug: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const notice = await noticeService.getNoticeBySlug(req.params.slug as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'Notice fetched successfully',
      data: notice,
    });
  }),

  // GET /notices/:id
  getById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const notice = await noticeService.getNoticeById(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'Notice fetched successfully',
      data: notice,
    });
  }),

  // POST /notices
  create: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const notice = await noticeService.createNotice(req.body as CreateNoticeInput);

    sendResponse(res, {
      statusCode: 201,
      message: 'Notice created successfully',
      data: notice,
    });
  }),

  // PUT /notices/:id
  update: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const notice = await noticeService.updateNotice(
      req.params.id as string,
      req.body as UpdateNoticeInput,
    );

    sendResponse(res, {
      statusCode: 200,
      message: 'Notice updated successfully',
      data: notice,
    });
  }),

  // DELETE /notices/:id
  delete: catchAsync(async (req: Request, res: Response): Promise<void> => {
    await noticeService.deleteNotice(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'Notice deleted successfully',
    });
  }),
};
