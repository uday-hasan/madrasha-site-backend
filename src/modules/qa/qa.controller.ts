import { Request, Response } from 'express';
import { qaService } from './qa.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export const qaController = {
  // Get all published questions (public)
  getAllPublished: catchAsync(async (_req: Request, res: Response) => {
    const result = await qaService.getAllPublished();
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রকাশিত প্রশ্নগুলি সফলভাবে লোড হয়েছে',
      data: result,
    });
  }),

  // Get all questions (admin)
  getAll: catchAsync(async (_req: Request, res: Response) => {
    const result = await qaService.getAll();
    sendResponse(res, {
      statusCode: 200,
      message: 'সমস্ত প্রশ্ন লোড হয়েছে',
      data: result,
    });
  }),

  // Get question by ID
  getById: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await qaService.getById(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রশ্ন লোড হয়েছে',
      data: result,
    });
  }),

  // Create new question (public - creates as draft)
  createQuestion: catchAsync(async (req: Request, res: Response) => {
    const result = await qaService.createQuestion(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'প্রশ্ন সফলভাবে জমা দেওয়া হয়েছে। অ্যাডমিন অনুমোদনের পরে প্রকাশিত হবে।',
      data: result,
    });
  }),

  // Update question (admin)
  updateQuestion: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await qaService.updateQuestion(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রশ্ন আপডেট হয়েছে',
      data: result,
    });
  }),

  // Publish question (admin)
  publishQuestion: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await qaService.publishQuestion(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রশ্ন প্রকাশিত হয়েছে',
      data: result,
    });
  }),

  // Unpublish question (admin)
  unpublishQuestion: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await qaService.unpublishQuestion(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রশ্ন খসড়ায় রূপান্তরিত হয়েছে',
      data: result,
    });
  }),

  // Delete question (admin)
  deleteQuestion: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await qaService.deleteQuestion(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রশ্ন মুছে ফেলা হয়েছে',
    });
  }),

  // Add answer (admin)
  addAnswer: catchAsync(async (req: Request, res: Response) => {
    const questionId = req.params.questionId as string;
    const result = await qaService.addAnswer(questionId, req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'উত্তর সফলভাবে যোগ করা হয়েছে',
      data: result,
    });
  }),

  // Update answer (admin)
  updateAnswer: catchAsync(async (req: Request, res: Response) => {
    const answerId = req.params.answerId as string;
    const result = await qaService.updateAnswer(answerId, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'উত্তর আপডেট হয়েছে',
      data: result,
    });
  }),

  // Delete answer (admin)
  deleteAnswer: catchAsync(async (req: Request, res: Response) => {
    const answerId = req.params.answerId as string;
    await qaService.deleteAnswer(answerId);
    sendResponse(res, {
      statusCode: 200,
      message: 'উত্তর মুছে ফেলা হয়েছে',
    });
  }),

  // Add reply (public)
  addReply: catchAsync(async (req: Request, res: Response) => {
    const answerId = req.params.answerId as string;
    const result = await qaService.addReply(answerId, req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'মন্তব্য সফলভাবে যোগ করা হয়েছে',
      data: result,
    });
  }),

  // Delete reply (admin)
  deleteReply: catchAsync(async (req: Request, res: Response) => {
    const replyId = req.params.replyId as string;
    await qaService.deleteReply(replyId);
    sendResponse(res, {
      statusCode: 200,
      message: 'মন্তব্য মুছে ফেলা হয়েছে',
    });
  }),
};
