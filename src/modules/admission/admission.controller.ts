import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { admissionService } from './admission.service';
import { StatusCodes } from 'http-status-codes';

export const admissionController = {
  // ============ PUBLIC ENDPOINTS ============
  getFullAdmissionInfo: catchAsync(async (_req: Request, res: Response) => {
    const data = await admissionService.getFullAdmissionInfo();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'সম্পূর্ণ ভর্তি তথ্য পাওয়া গেছে',
      data,
    });
  }),

  // ============ ADMIN ENDPOINTS: SETTINGS ============
  getSettings: catchAsync(async (_req: Request, res: Response) => {
    const data = await admissionService.getSettings();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'ভর্তি সেটিংস পাওয়া গেছে',
      data,
    });
  }),

  updateSettings: catchAsync(async (req: Request, res: Response) => {
    const data = await admissionService.updateSettings(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'ভর্তি সেটিংস আপডেট করা হয়েছে',
      data,
    });
  }),

  // ============ ADMIN ENDPOINTS: PROCESSES ============
  getAdminProcesses: catchAsync(async (_req: Request, res: Response) => {
    const data = await admissionService.getAllProcesses();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'সব ভর্তি প্রক্রিয়া পাওয়া গেছে',
      data,
    });
  }),

  createProcess: catchAsync(async (req: Request, res: Response) => {
    const data = await admissionService.createProcess(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,

      message: 'ভর্তি প্রক্রিয়া যোগ করা হয়েছে',
      data,
    });
  }),

  updateProcess: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await admissionService.updateProcess(id as string, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'ভর্তি প্রক্রিয়া আপডেট করা হয়েছে',
      data,
    });
  }),

  deleteProcess: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await admissionService.deleteProcess(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'ভর্তি প্রক্রিয়া মুছে ফেলা হয়েছে',
      data,
    });
  }),

  // ============ ADMIN ENDPOINTS: REQUIREMENTS ============
  getAdminRequirements: catchAsync(async (req: Request, res: Response) => {
    const { departmentId } = req.query;
    const data = await admissionService.getAllRequirements(departmentId as string | undefined);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'সব ভর্তি প্রয়োজনীয়তা পাওয়া গেছে',
      data,
    });
  }),

  getRequirementById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await admissionService.getRequirementById(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'ভর্তি প্রয়োজনীয়তা পাওয়া গেছে',
      data,
    });
  }),

  createRequirement: catchAsync(async (req: Request, res: Response) => {
    const data = await admissionService.createRequirement(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,

      message: 'ভর্তি প্রয়োজনীয়তা যোগ করা হয়েছে',
      data,
    });
  }),

  updateRequirement: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await admissionService.updateRequirement(id as string, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'ভর্তি প্রয়োজনীয়তা আপডেট করা হয়েছে',
      data,
    });
  }),

  deleteRequirement: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await admissionService.deleteRequirement(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'ভর্তি প্রয়োজনীয়তা মুছে ফেলা হয়েছে',
      data,
    });
  }),

  // ============ ADMIN ENDPOINTS: IMPORTANT DATES ============
  getAdminImportantDates: catchAsync(async (_req: Request, res: Response) => {
    const data = await admissionService.getAllImportantDates();
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'সব গুরুত্বপূর্ণ তারিখ পাওয়া গেছে',
      data,
    });
  }),

  getImportantDateById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await admissionService.getImportantDateById(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'গুরুত্বপূর্ণ তারিখ পাওয়া গেছে',
      data,
    });
  }),

  createImportantDate: catchAsync(async (req: Request, res: Response) => {
    const data = await admissionService.createImportantDate(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,

      message: 'গুরুত্বপূর্ণ তারিখ যোগ করা হয়েছে',
      data,
    });
  }),

  updateImportantDate: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await admissionService.updateImportantDate(id as string, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'গুরুত্বপূর্ণ তারিখ আপডেট করা হয়েছে',
      data,
    });
  }),

  deleteImportantDate: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await admissionService.deleteImportantDate(id as string);
    sendResponse(res, {
      statusCode: StatusCodes.OK,

      message: 'গুরুত্বপূর্ণ তারিখ মুছে ফেলা হয়েছে',
      data,
    });
  }),
};
