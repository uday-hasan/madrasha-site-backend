import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { applicationService } from './application.service';
import { ApplicationStatus } from '@/generated/prisma/enums';

export const applicationController = {
  // ============ PUBLIC ENDPOINTS ============

  // Create new application
  createApplication: catchAsync(async (req: Request, res: Response) => {
    const application = await applicationService.createApplication(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'আবেদন সফলভাবে জমা দেওয়া হয়েছে',
      data: application,
    });
  }),

  // ============ ADMIN ENDPOINTS ============

  // Get all applications with filters
  getApplications: catchAsync(async (req: Request, res: Response) => {
    const { page, limit, status, departmentId, paymentMethod, search } = req.query;

    const result = await applicationService.getApplications({
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      status: status as ApplicationStatus | undefined,
      departmentId: departmentId as string | undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentMethod: paymentMethod as any | undefined,
      search: search as string | undefined,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'আবেদনগুলি সফলভাবে পাওয়া গেছে',
      data: result.data,
      meta: result.meta,
    });
  }),

  // Get single application
  getApplicationById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const application = await applicationService.getApplicationById(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'আবেদন সফলভাবে পাওয়া গেছে',
      data: application,
    });
  }),

  // Update application status
  updateApplicationStatus: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(ApplicationStatus).includes(status)) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'অবৈধ আবেদন স্ট্যাটাস',
        data: null,
      });
    }

    const application = await applicationService.updateApplicationStatus(id as string, status);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'আবেদন স্ট্যাটাস আপডেট করা হয়েছে',
      data: application,
    });
  }),

  // Get applications statistics
  getApplicationStats: catchAsync(async (_req: Request, res: Response) => {
    const stats = await applicationService.getApplicationStats();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'আবেদন পরিসংখ্যান পাওয়া গেছে',
      data: stats,
    });
  }),

  // Delete application
  deleteApplication: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await applicationService.deleteApplication(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: result.message,
      data: null,
    });
  }),
};
