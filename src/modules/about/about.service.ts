/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import { deleteFile, getFullUrl, urlToFilePath } from '../../utils/fileUpload';
import { slugify } from '../../utils/helpers';

export const aboutService = {
  // ============ ABOUT SECTIONS ============
  getAboutSections: async () => {
    return prisma.aboutSection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllAboutSections: async () => {
    return prisma.aboutSection.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAboutSectionById: async (id: string) => {
    const section = await prisma.aboutSection.findUnique({
      where: { id },
    });
    if (!section) {
      throw new AppError('সেকশন পাওয়া যায়নি', 404);
    }
    return section;
  },

  createAboutSection: async (data: {
    title: string;
    slug?: string;
    description: string;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    // Auto-generate slug from title if not provided
    let slug = data.slug || slugify(data.title);

    // Check if slug already exists and make it unique
    let counter = 1;
    let baseSlug = slug;
    while (await prisma.aboutSection.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return prisma.aboutSection.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  updateAboutSection: async (
    id: string,
    data: Partial<{
      title: string;
      slug?: string;
      description: string;
      displayOrder: number;
      isActive: boolean;
    }>,
  ) => {
    const existing = await prisma.aboutSection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('সেকশন পাওয়া যায়নি', 404);
    }

    // Auto-generate slug from title if title is being changed and slug is not provided
    let updateData = { ...data };
    if (data.title && !data.slug) {
      let newSlug = slugify(data.title);
      let counter = 1;
      let baseSlug = newSlug;
      // Check for duplicates, but exclude current id
      while (true) {
        const foundSlug = await prisma.aboutSection.findUnique({
          where: { slug: newSlug },
        });
        if (!foundSlug || foundSlug.id === id) break;
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = newSlug;
    }

    return prisma.aboutSection.update({
      where: { id },
      data: updateData,
    });
  },

  deleteAboutSection: async (id: string) => {
    return prisma.aboutSection.delete({
      where: { id },
    });
  },

  // ============ ABOUT VALUES ============
  getAboutValues: async () => {
    return prisma.aboutValue.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllAboutValues: async () => {
    return prisma.aboutValue.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  createAboutValue: async (data: {
    title: string;
    description: string;
    icon?: string;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.aboutValue.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  updateAboutValue: async (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      icon: string;
      displayOrder: number;
      isActive: boolean;
    }>,
  ) => {
    return prisma.aboutValue.update({
      where: { id },
      data,
    });
  },

  deleteAboutValue: async (id: string) => {
    return prisma.aboutValue.delete({
      where: { id },
    });
  },

  // ============ ACHIEVEMENTS ============
  getAchievements: async () => {
    return prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllAchievements: async () => {
    return prisma.achievement.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  createAchievement: async (data: {
    year: string;
    title: string;
    description: string;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.achievement.create({
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  updateAchievement: async (
    id: string,
    data: Partial<{
      year: string;
      title: string;
      description: string;
      displayOrder: number;
      isActive: boolean;
    }>,
  ) => {
    return prisma.achievement.update({
      where: { id },
      data,
    });
  },

  deleteAchievement: async (id: string) => {
    return prisma.achievement.delete({
      where: { id },
    });
  },

  // ============ PROPOSED BUILDINGS ============
  getProposedBuildings: async () => {
    return prisma.proposedBuilding.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllProposedBuildings: async () => {
    return prisma.proposedBuilding.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  createProposedBuilding: async (
    data: {
      title: string;
      imageUrl?: string;
      status?: string;
      estimatedCost?: string;
      description?: string;
      displayOrder?: number;
      isActive?: boolean;
    },
    file?: Express.Multer.File,
    req?: any,
  ) => {
    let finalImageUrl: string | undefined = undefined;

    // Detect base URL from request if available
    let baseUrl: string | undefined = undefined;
    if (req) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      baseUrl = `${protocol}://${host}`;
    }

    if (file) {
      // Use uploaded file
      const fileUrl = getFullUrl(`/uploads/images/${file.filename}`, baseUrl);
      finalImageUrl = fileUrl || undefined;
    } else if (data.imageUrl) {
      // Use provided URL
      finalImageUrl = data.imageUrl;
    }

    return prisma.proposedBuilding.create({
      data: {
        title: data.title,
        imageUrl: finalImageUrl,
        status: data.status ?? 'Planning',
        estimatedCost: data.estimatedCost,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  updateProposedBuilding: async (
    id: string,
    data: Partial<{
      title: string;
      imageUrl: string;
      status: string;
      estimatedCost: string;
      description: string;
      displayOrder: number;
      isActive: boolean;
    }>,
    file?: Express.Multer.File,
    req?: any,
  ) => {
    const existing = await prisma.proposedBuilding.findUnique({ where: { id } });
    if (!existing) throw new AppError('ভবন পাওয়া যায়নি', 404);

    // Detect base URL from request if available
    let baseUrl: string | undefined = undefined;
    if (req) {
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      baseUrl = `${protocol}://${host}`;
    }

    let imageUrl: string | undefined = data.imageUrl || existing.imageUrl || undefined;

    if (file) {
      // Delete old local file if it exists
      const oldPath = urlToFilePath(existing.imageUrl || '');
      if (oldPath) deleteFile(oldPath);

      // Save new file path as full URL
      const fileUrl = getFullUrl(`/uploads/images/${file.filename}`, baseUrl);
      imageUrl = fileUrl || undefined;
    }

    const updateData: any = { ...data, imageUrl };

    return prisma.proposedBuilding.update({
      where: { id },
      data: updateData,
    });
  },

  deleteProposedBuilding: async (id: string) => {
    const building = await prisma.proposedBuilding.findUnique({ where: { id } });
    if (!building) throw new AppError('ভবন পাওয়া যায়নি', 404);

    // Try to delete local file if it exists
    if (building.imageUrl) {
      const filePath = urlToFilePath(building.imageUrl);
      if (filePath) deleteFile(filePath);
    }

    return prisma.proposedBuilding.delete({
      where: { id },
    });
  },

  // ============ LEADERSHIP ============
  getLeadership: async () => {
    return prisma.leadership.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllLeadership: async () => {
    return prisma.leadership.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  createLeadershipMember: async (data: {
    name: string;
    designation: string;
    photoUrl?: string;
    bio?: string;
    email?: string;
    phone?: string;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.leadership.create({
      data: {
        name: data.name,
        designation: data.designation,
        photoUrl: data.photoUrl,
        bio: data.bio,
        email: data.email,
        phone: data.phone,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  updateLeadershipMember: async (
    id: string,
    data: Partial<{
      name: string;
      designation: string;
      photoUrl: string;
      bio: string;
      email: string;
      phone: string;
      displayOrder: number;
      isActive: boolean;
    }>,
  ) => {
    return prisma.leadership.update({
      where: { id },
      data,
    });
  },

  deleteLeadershipMember: async (id: string) => {
    return prisma.leadership.delete({
      where: { id },
    });
  },

  // ============ ABOUT QUOTES ============
  getAboutQuotes: async () => {
    return prisma.aboutQuote.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllAboutQuotes: async () => {
    return prisma.aboutQuote.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  createAboutQuote: async (data: {
    quote: string;
    author: string;
    authorRole?: string;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.aboutQuote.create({
      data: {
        quote: data.quote,
        author: data.author,
        authorRole: data.authorRole ?? 'Founder',
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  updateAboutQuote: async (
    id: string,
    data: Partial<{
      quote: string;
      author: string;
      authorRole: string;
      displayOrder: number;
      isActive: boolean;
    }>,
  ) => {
    return prisma.aboutQuote.update({
      where: { id },
      data,
    });
  },

  deleteAboutQuote: async (id: string) => {
    return prisma.aboutQuote.delete({
      where: { id },
    });
  },
};
