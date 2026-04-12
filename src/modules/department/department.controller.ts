import { Request, Response } from 'express';
import { departmentService } from './department.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';
import type { CreateDepartmentInput, UpdateDepartmentInput, DepartmentQuery } from './department.validation';

// ================================
// DEPARTMENT CONTROLLER
// ================================

export const departmentController = {
  // GET /departments
  getAll: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await departmentService.getAllDepartments(req.query as unknown as DepartmentQuery);

    sendResponse(res, {
      statusCode: 200,
      message: 'Departments fetched successfully',
      data: result.data,
      meta: result.meta,
    });
  }),

  // GET /departments/active
  getActive: catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const departments = await departmentService.getActiveDepartments();

    sendResponse(res, {
      statusCode: 200,
      message: 'Active departments fetched successfully',
      data: departments,
    });
  }),

  // GET /departments/:id
  getById: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const department = await departmentService.getDepartmentById(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'Department fetched successfully',
      data: department,
    });
  }),

  // GET /departments/slug/:slug
  getBySlug: catchAsync(async (req: Request, res: Response): Promise<void> => {
    const department = await departmentService.getDepartmentBySlug(req.params.slug as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'Department fetched successfully',
      data: department,
    });
  }),

  // POST /departments
  create: catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Validate file size (5MB max for images)
    if (req.file && req.file.size > 5 * 1024 * 1024) {
      throw new AppError('Image file too large. Maximum size allowed is 5MB.', 413);
    }

    const department = await departmentService.createDepartment(
      req.body as CreateDepartmentInput,
      req.file,
    );

    sendResponse(res, {
      statusCode: 201,
      message: 'Department created successfully',
      data: department,
    });
  }),

  // PUT /departments/:id
  update: catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Validate file size (5MB max for images)
    if (req.file && req.file.size > 5 * 1024 * 1024) {
      throw new AppError('Image file too large. Maximum size allowed is 5MB.', 413);
    }

    const department = await departmentService.updateDepartment(
      req.params.id as string,
      req.body as UpdateDepartmentInput,
      req.file,
    );

    sendResponse(res, {
      statusCode: 200,
      message: 'Department updated successfully',
      data: department,
    });
  }),

  // DELETE /departments/:id
  delete: catchAsync(async (req: Request, res: Response): Promise<void> => {
    await departmentService.deleteDepartment(req.params.id as string);

    sendResponse(res, {
      statusCode: 200,
      message: 'Department deleted successfully',
    });
  }),
};
