import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';

export const teacherService = {
  // Get all teachers (public - only active)
  getAllActive: async () => {
    return prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'desc' },
    });
  },

  // Get all teachers (admin)
  getAll: async () => {
    return prisma.teacher.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  // Get teacher by id
  getById: async (id: string) => {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
    });
    if (!teacher) {
      throw new AppError('শিক্ষক পাওয়া যায়নি', 404);
    }
    return teacher;
  },

  // Create new teacher
  create: async (data: {
    name: string;
    designation: string;
    department?: string;
    education?: string;
    experience?: string;
    photoUrl?: string;
    bio?: string;
    phone?: string;
    email?: string;
    isActive?: boolean;
    displayOrder?: number;
  }) => {
    return prisma.teacher.create({
      data: {
        name: data.name,
        designation: data.designation,
        department: data.department,
        education: data.education,
        experience: data.experience,
        photoUrl: data.photoUrl,
        bio: data.bio,
        phone: data.phone,
        email: data.email,
        isActive: data.isActive ?? true,
        displayOrder: data.displayOrder ?? 0,
      },
    });
  },

  // Update teacher
  update: async (
    id: string,
    data: {
      name?: string;
      designation?: string;
      department?: string;
      education?: string;
      experience?: string;
      photoUrl?: string;
      bio?: string;
      phone?: string;
      email?: string;
      isActive?: boolean;
      displayOrder?: number;
    },
  ) => {
    const existing = await prisma.teacher.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError('শিক্ষক পাওয়া যায়নি', 404);
    }
    return prisma.teacher.update({
      where: { id },
      data,
    });
  },

  // Delete teacher
  delete: async (id: string) => {
    const existing = await prisma.teacher.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError('শিক্ষক পাওয়া যায়নি', 404);
    }
    return prisma.teacher.delete({
      where: { id },
    });
  },
};
