import { Request, Response } from 'express';
import { aboutService } from './about.service';
import { sendResponse } from '../../utils/sendResponse';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/AppError';

export const aboutController = {
  // ============ ABOUT SECTIONS ============
  getAboutSections: catchAsync(async (_req: Request, res: Response) => {
    const sections = await aboutService.getAboutSections();
    sendResponse(res, {
      statusCode: 200,
      message: 'সেকশনগুলি পাওয়া গেছে',
      data: sections,
    });
  }),

  getAllAboutSections: catchAsync(async (_req: Request, res: Response) => {
    const sections = await aboutService.getAllAboutSections();
    sendResponse(res, {
      statusCode: 200,
      message: 'সকল সেকশন পাওয়া গেছে',
      data: sections,
    });
  }),

  getAboutSectionById: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const section = await aboutService.getAboutSectionById(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'সেকশন পাওয়া গেছে',
      data: section,
    });
  }),

  createAboutSection: catchAsync(async (req: Request, res: Response) => {
    const section = await aboutService.createAboutSection(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'সেকশন তৈরি করা হয়েছে',
      data: section,
    });
  }),

  updateAboutSection: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const section = await aboutService.updateAboutSection(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'সেকশন আপডেট করা হয়েছে',
      data: section,
    });
  }),

  deleteAboutSection: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await aboutService.deleteAboutSection(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'সেকশন ডিলিট করা হয়েছে',
      data: null,
    });
  }),

  // ============ ABOUT VALUES ============
  getAboutValues: catchAsync(async (_req: Request, res: Response) => {
    const values = await aboutService.getAboutValues();
    sendResponse(res, {
      statusCode: 200,
      message: 'মূল্যবোধগুলি পাওয়া গেছে',
      data: values,
    });
  }),

  getAllAboutValues: catchAsync(async (_req: Request, res: Response) => {
    const values = await aboutService.getAllAboutValues();
    sendResponse(res, {
      statusCode: 200,
      message: 'সকল মূল্যবোধ পাওয়া গেছে',
      data: values,
    });
  }),

  createAboutValue: catchAsync(async (req: Request, res: Response) => {
    const value = await aboutService.createAboutValue(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'মূল্যবোধ তৈরি করা হয়েছে',
      data: value,
    });
  }),

  updateAboutValue: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const value = await aboutService.updateAboutValue(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'মূল্যবোধ আপডেট করা হয়েছে',
      data: value,
    });
  }),

  deleteAboutValue: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await aboutService.deleteAboutValue(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'মূল্যবোধ ডিলিট করা হয়েছে',
      data: null,
    });
  }),

  // ============ ACHIEVEMENTS ============
  getAchievements: catchAsync(async (_req: Request, res: Response) => {
    const achievements = await aboutService.getAchievements();
    sendResponse(res, {
      statusCode: 200,
      message: 'অর্জনগুলি পাওয়া গেছে',
      data: achievements,
    });
  }),

  getAllAchievements: catchAsync(async (_req: Request, res: Response) => {
    const achievements = await aboutService.getAllAchievements();
    sendResponse(res, {
      statusCode: 200,
      message: 'সকল অর্জন পাওয়া গেছে',
      data: achievements,
    });
  }),

  createAchievement: catchAsync(async (req: Request, res: Response) => {
    const achievement = await aboutService.createAchievement(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'অর্জন তৈরি করা হয়েছে',
      data: achievement,
    });
  }),

  updateAchievement: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const achievement = await aboutService.updateAchievement(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'অর্জন আপডেট করা হয়েছে',
      data: achievement,
    });
  }),

  deleteAchievement: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await aboutService.deleteAchievement(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'অর্জন ডিলিট করা হয়েছে',
      data: null,
    });
  }),

  // ============ PROPOSED BUILDINGS ============
  getProposedBuildings: catchAsync(async (_req: Request, res: Response) => {
    const buildings = await aboutService.getProposedBuildings();
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রস্তাবিত ভবন পাওয়া গেছে',
      data: buildings,
    });
  }),

  getAllProposedBuildings: catchAsync(async (_req: Request, res: Response) => {
    const buildings = await aboutService.getAllProposedBuildings();
    sendResponse(res, {
      statusCode: 200,
      message: 'সকল প্রস্তাবিত ভবন পাওয়া গেছে',
      data: buildings,
    });
  }),

  createProposedBuilding: catchAsync(async (req: Request, res: Response) => {
    // Validate file size if provided (5MB max for images)
    if (req.file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new AppError('ফাইলের সাইজ খুব বড়। সর্বোচ্চ ৫ এমবি অনুমোদিত।', 413);
      }
    }

    // Parse numeric fields from FormData
    const parsedData = {
      ...req.body,
      displayOrder: req.body.displayOrder ? parseInt(req.body.displayOrder, 10) : 0,
    };

    const building = await aboutService.createProposedBuilding(parsedData, req.file, req);
    sendResponse(res, {
      statusCode: 201,
      message: 'প্রস্তাবিত ভবন তৈরি করা হয়েছে',
      data: building,
    });
  }),

  updateProposedBuilding: catchAsync(async (req: Request, res: Response) => {
    // Validate file size if provided (5MB max for images)
    if (req.file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new AppError('ফাইলের সাইজ খুব বড়। সর্বোচ্চ ৫ এমবি অনুমোদিত।', 413);
      }
    }

    // Parse numeric fields from FormData
    const parsedData = {
      ...req.body,
      displayOrder: req.body.displayOrder ? parseInt(req.body.displayOrder, 10) : undefined,
    };

    const id = req.params.id as string;
    const building = await aboutService.updateProposedBuilding(id, parsedData, req.file, req);
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রস্তাবিত ভবন আপডেট করা হয়েছে',
      data: building,
    });
  }),

  deleteProposedBuilding: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await aboutService.deleteProposedBuilding(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'প্রস্তাবিত ভবন ডিলিট করা হয়েছে',
      data: null,
    });
  }),

  // ============ LEADERSHIP ============
  getLeadership: catchAsync(async (_req: Request, res: Response) => {
    const leadership = await aboutService.getLeadership();
    sendResponse(res, {
      statusCode: 200,
      message: 'নেতৃত্ব টিম পাওয়া গেছে',
      data: leadership,
    });
  }),

  getAllLeadership: catchAsync(async (_req: Request, res: Response) => {
    const leadership = await aboutService.getAllLeadership();
    sendResponse(res, {
      statusCode: 200,
      message: 'সকল নেতৃত্ব সদস্য পাওয়া গেছে',
      data: leadership,
    });
  }),

  createLeadershipMember: catchAsync(async (req: Request, res: Response) => {
    const member = await aboutService.createLeadershipMember(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'নেতৃত্ব সদস্য যোগ করা হয়েছে',
      data: member,
    });
  }),

  updateLeadershipMember: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const member = await aboutService.updateLeadershipMember(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'নেতৃত্ব সদস্য আপডেট করা হয়েছে',
      data: member,
    });
  }),

  deleteLeadershipMember: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await aboutService.deleteLeadershipMember(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'নেতৃত্ব সদস্য ডিলিট করা হয়েছে',
      data: null,
    });
  }),

  // ============ ABOUT QUOTES ============
  getAboutQuotes: catchAsync(async (_req: Request, res: Response) => {
    const quotes = await aboutService.getAboutQuotes();
    sendResponse(res, {
      statusCode: 200,
      message: 'উদ্ধৃতিগুলি পাওয়া গেছে',
      data: quotes,
    });
  }),

  getAllAboutQuotes: catchAsync(async (_req: Request, res: Response) => {
    const quotes = await aboutService.getAllAboutQuotes();
    sendResponse(res, {
      statusCode: 200,
      message: 'সকল উদ্ধৃতি পাওয়া গেছে',
      data: quotes,
    });
  }),

  createAboutQuote: catchAsync(async (req: Request, res: Response) => {
    const quote = await aboutService.createAboutQuote(req.body);
    sendResponse(res, {
      statusCode: 201,
      message: 'উদ্ধৃতি তৈরি করা হয়েছে',
      data: quote,
    });
  }),

  updateAboutQuote: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const quote = await aboutService.updateAboutQuote(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      message: 'উদ্ধৃতি আপডেট করা হয়েছে',
      data: quote,
    });
  }),

  deleteAboutQuote: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await aboutService.deleteAboutQuote(id);
    sendResponse(res, {
      statusCode: 200,
      message: 'উদ্ধৃতি ডিলিট করা হয়েছে',
      data: null,
    });
  }),
};
