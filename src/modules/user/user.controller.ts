import { Request, Response } from 'express';
import { userService } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import type { UpdateProfileInput, GetUsersQuery } from './user.validation';
import { Role } from '@/generated/prisma/enums';

export const userController = {
  // GET /users — Admin only
  getAllUsers: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.getAllUsers(req.query as unknown as GetUsersQuery);

    sendResponse(res, {
      statusCode: 200,
      message: 'Users fetched successfully',
      data: result.data,
      meta: result.meta,
    });
  }),

  // GET /users/:id
  getUserById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = await userService.getUserById(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'User fetched successfully',
      data: user,
    });
  }),

  // PATCH /users/profile
  updateProfile: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = await userService.updateProfile(req.user!.userId, req.body as UpdateProfileInput);

    sendResponse(res, {
      statusCode: 200,
      message: 'Profile updated successfully',
      data: user,
    });
  }),

  // PATCH /users/:id/toggle-status — Admin only
  toggleUserStatus: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = await userService.toggleUserStatus(req.params.id as string, req.user!.userId);

    sendResponse(res, {
      statusCode: 200,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  }),

  // PATCH /users/:id/role — Admin only
  changeUserRole: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { role } = req.body as { role: Role };
    const user = await userService.changeUserRole(req.params.id as string, role, req.user!.userId);

    sendResponse(res, {
      statusCode: 200,
      message: 'User role updated successfully',
      data: user,
    });
  }),
};
