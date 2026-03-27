import { Role } from '@/generated/prisma/enums';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';

import type { UpdateProfileInput, GetUsersQuery } from './user.validation';
import { getPaginationParams } from '@/utils/pagination';

// ================================
// USER SERVICE
// ================================

export const userService = {
  // ---- GET ALL USERS (Admin only) ----
  async getAllUsers(query: GetUsersQuery) {
    const { page, limit, search, role, isActive } = query;
    const { skip, take } = getPaginationParams(page, limit);

    // Build dynamic where clause
    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
    };

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        page: page ?? 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  },

  // ---- GET USER BY ID ----
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  // ---- UPDATE PROFILE ----
  async updateProfile(userId: string, data: UpdateProfileInput) {
    // If updating email, check it's not already taken
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: { email: data.email, NOT: { id: userId } },
      });

      if (existingUser) {
        throw new AppError('This email is already in use', 409);
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return user;
  },

  // ---- TOGGLE USER ACTIVE STATUS (Admin only) ----
  async toggleUserStatus(id: string, requestingUserId: string) {
    // Prevent admin from deactivating themselves
    if (id === requestingUserId) {
      throw new AppError('You cannot deactivate your own account', 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, name: true, email: true, isActive: true },
    });

    return updated;
  },

  // ---- CHANGE USER ROLE (Admin only) ----
  async changeUserRole(id: string, role: Role, requestingUserId: string) {
    if (id === requestingUserId) {
      throw new AppError('You cannot change your own role', 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return updated;
  },
};
