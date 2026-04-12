import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
import { getPaginationParams } from '../../utils/pagination';
import { slugify, generateUniqueSlug } from '../../utils/helpers';
import { deleteFile, urlToFilePath } from '../../utils/fileUpload';
import type { CreateDepartmentInput, UpdateDepartmentInput, DepartmentQuery } from './department.validation';

// ================================
// DEPARTMENT SERVICE
// ================================

export const departmentService = {
  // ---- GET ALL ----
  async getAllDepartments(query: DepartmentQuery) {
    const { page, limit, isActive, search } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where = {
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [departments, total] = await prisma.$transaction([
      prisma.department.findMany({
        where,
        skip,
        take,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.department.count({ where }),
    ]);

    return {
      data: departments,
      meta: {
        page: page ?? 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    };
  },

  // ---- GET ACTIVE ONLY (for public frontend) ----
  async getActiveDepartments() {
    return prisma.department.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  },

  // ---- GET BY ID ----
  async getDepartmentById(id: string) {
    const department = await prisma.department.findUnique({ where: { id } });

    if (!department) {
      throw new AppError('Department not found', 404);
    }

    return department;
  },

  // ---- GET BY SLUG ----
  async getDepartmentBySlug(slug: string) {
    const department = await prisma.department.findUnique({ where: { slug } });

    if (!department) {
      throw new AppError('Department not found', 404);
    }

    return department;
  },

  // ---- CREATE ----
  async createDepartment(data: CreateDepartmentInput, file?: Express.Multer.File) {
    const {
      name,
      description,
      duration,
      subjects,
      headTeacher,
      totalStudents,
      isActive,
      displayOrder,
      slug,
    } = data;

    // Generate slug if not provided
    let finalSlug = slug ? slugify(slug) : generateUniqueSlug(name);

    // Ensure slug is unique
    const existing = await prisma.department.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = generateUniqueSlug(name);
    }

    // Handle file upload
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = `/uploads/images/${file.filename}`;
    }

    return prisma.department.create({
      data: {
        name,
        description,
        duration,
        subjects: subjects ?? [],
        headTeacher,
        totalStudents: totalStudents ?? 0,
        imageUrl,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
        slug: finalSlug,
      },
    });
  },

  // ---- UPDATE ----
  async updateDepartment(id: string, data: UpdateDepartmentInput, file?: Express.Multer.File) {
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Department not found', 404);
    }

    // Handle slug update
    let finalSlug = existing.slug;
    if (data.slug) {
      const newSlug = slugify(data.slug);
      // Check if new slug is already taken by another department
      const slugExists = await prisma.department.findFirst({
        where: { slug: newSlug, NOT: { id } },
      });
      if (slugExists) {
        throw new AppError('A department with this slug already exists', 409);
      }
      finalSlug = newSlug;
    }

    // Handle file upload
    let imageUrl = data.imageUrl ?? existing.imageUrl ?? undefined;
    if (file) {
      // Delete old file if exists
      if (existing.imageUrl && !existing.imageUrl.startsWith('http')) {
        deleteFile(urlToFilePath(existing.imageUrl));
      }
      imageUrl = `/uploads/images/${file.filename}`;
    }

    return prisma.department.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.subjects !== undefined && { subjects: data.subjects }),
        ...(data.headTeacher !== undefined && { headTeacher: data.headTeacher }),
        ...(data.totalStudents !== undefined && { totalStudents: data.totalStudents }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        imageUrl,
        slug: finalSlug,
      },
    });
  },

  // ---- DELETE ----
  async deleteDepartment(id: string) {
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) {
      throw new AppError('Department not found', 404);
    }

    // Delete associated image file
    if (department.imageUrl && !department.imageUrl.startsWith('http')) {
      deleteFile(urlToFilePath(department.imageUrl));
    }

    await prisma.department.delete({ where: { id } });
  },
};
