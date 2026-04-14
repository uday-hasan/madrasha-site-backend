import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';

export const settingsService = {
  // Get all settings (for admin)
  getAll: async () => {
    return prisma.siteSettings.findMany({
      orderBy: { category: 'asc', key: 'asc' },
    });
  },

  // Get public settings only
  getPublic: async () => {
    return prisma.siteSettings.findMany({
      where: { isPublic: true },
      orderBy: { category: 'asc', key: 'asc' },
    });
  },

  // Get settings by category (public)
  getByCategory: async (category: string) => {
    return prisma.siteSettings.findMany({
      where: { category, isPublic: true },
      orderBy: { key: 'asc' },
    });
  },

  // Get setting by key (public)
  getByKey: async (key: string) => {
    const setting = await prisma.siteSettings.findFirst({
      where: { key, isPublic: true },
    });
    if (!setting) {
      throw new AppError('সেটিং পাওয়া যায়নি', 404);
    }
    return setting;
  },

  // Create new setting
  create: async (data: {
    key: string;
    value: string;
    category: string;
    description?: string;
    isPublic?: boolean;
  }) => {
    // Check if key already exists
    const existing = await prisma.siteSettings.findUnique({
      where: { key: data.key },
    });
    if (existing) {
      throw new AppError('এই কী-এর একটি সেটিং ইতিমধ্যে বিদ্যমান', 400);
    }

    return prisma.siteSettings.create({
      data: {
        key: data.key,
        value: data.value,
        category: data.category,
        description: data.description,
        isPublic: data.isPublic ?? true,
      },
    });
  },

  // Update setting
  update: async (
    id: string,
    data: {
      value: string;
      description?: string;
      isPublic?: boolean;
    },
  ) => {
    return prisma.siteSettings.update({
      where: { id },
      data: {
        value: data.value,
        description: data.description,
        isPublic: data.isPublic,
      },
    });
  },

  // Delete setting
  delete: async (id: string) => {
    return prisma.siteSettings.delete({
      where: { id },
    });
  },
};
