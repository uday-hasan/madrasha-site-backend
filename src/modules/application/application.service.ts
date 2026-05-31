import { ApplicationStatus, PaymentMethod, PaymentStatus } from '@/generated/prisma/enums';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';
// import { ApplicationStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

interface CreateApplicationPayload {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  fatherName: string;
  fatherPhone: string;
  dateOfBirth: string;
  presentAddress: string;
  permanentAddress: string;
  departmentId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface GetApplicationsQuery {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  departmentId?: string;
  paymentMethod?: PaymentMethod;
  search?: string; // Search by student name or email
}

export const applicationService = {
  // ============ CREATE APPLICATION ============
  createApplication: async (payload: CreateApplicationPayload) => {
    // Validate department exists
    const department = await prisma.department.findUnique({
      where: { id: payload.departmentId },
    });

    if (!department) {
      throw new AppError('বিভাগ খুঁজে পাওয়া যায়নি', 400);
    }

    // Create the application
    const application = await prisma.studentApplication.create({
      data: {
        studentName: payload.studentName,
        studentEmail: payload.studentEmail,
        studentPhone: payload.studentPhone,
        fatherName: payload.fatherName,
        fatherPhone: payload.fatherPhone,
        dateOfBirth: payload.dateOfBirth,
        presentAddress: payload.presentAddress,
        permanentAddress: payload.permanentAddress,
        departmentId: payload.departmentId,
        paymentMethod: payload.paymentMethod,
        notes: payload.notes,
        status: ApplicationStatus.PENDING,
      },
      include: {
        department: true,
      },
    });

    // Create payment record
    if (payload.paymentMethod === PaymentMethod.CASH) {
      // For cash payment, mark as pending (payment will be done at institute)
      await prisma.applicationPayment.create({
        data: {
          applicationId: application.id,
          amount: 0, // Amount to be determined by admin
          paymentMethod: PaymentMethod.CASH,
          status: PaymentStatus.PENDING,
        },
      });
    } else if (payload.paymentMethod === PaymentMethod.ONLINE) {
      // For online payment, create payment record
      await prisma.applicationPayment.create({
        data: {
          applicationId: application.id,
          amount: 0, // Amount to be determined by admin/settings
          paymentMethod: PaymentMethod.ONLINE,
          status: PaymentStatus.PENDING,
        },
      });
    }

    return application;
  },

  // ============ GET ALL APPLICATIONS (ADMIN) ============
  getApplications: async (query: GetApplicationsQuery) => {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build where conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod;
    }

    if (query.search) {
      where.OR = [
        { studentName: { contains: query.search, mode: 'insensitive' } },
        { studentEmail: { contains: query.search, mode: 'insensitive' } },
        { studentPhone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.studentApplication.findMany({
        where,
        include: {
          department: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.studentApplication.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ============ GET SINGLE APPLICATION ============
  getApplicationById: async (applicationId: string) => {
    const application = await prisma.studentApplication.findUnique({
      where: { id: applicationId },
      include: {
        department: true,
        payments: true,
      },
    });

    if (!application) {
      throw new AppError('আবেদন খুঁজে পাওয়া যায়নি', 404);
    }

    return application;
  },

  // ============ UPDATE APPLICATION STATUS ============
  updateApplicationStatus: async (applicationId: string, status: ApplicationStatus) => {
    const application = await prisma.studentApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new AppError('আবেদন খুঁজে পাওয়া যায়নি', 404);
    }

    const updated = await prisma.studentApplication.update({
      where: { id: applicationId },
      data: { status },
      include: {
        department: true,
        payments: true,
      },
    });

    return updated;
  },

  // ============ GET APPLICATIONS STATS ============
  getApplicationStats: async () => {
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      byPaymentMethod,
    ] = await Promise.all([
      prisma.studentApplication.count(),
      prisma.studentApplication.count({
        where: { status: ApplicationStatus.PENDING },
      }),
      prisma.studentApplication.count({
        where: { status: ApplicationStatus.APPROVED },
      }),
      prisma.studentApplication.count({
        where: { status: ApplicationStatus.REJECTED },
      }),
      prisma.studentApplication.groupBy({
        by: ['paymentMethod'],
        _count: true,
      }),
    ]);

    return {
      total: totalApplications,
      pending: pendingApplications,
      approved: approvedApplications,
      rejected: rejectedApplications,
      byPaymentMethod,
    };
  },

  // ============ DELETE APPLICATION ============
  deleteApplication: async (applicationId: string) => {
    const application = await prisma.studentApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new AppError('আবেদন খুঁজে পাওয়া যায়নি', 404);
    }

    // Delete application (payments will be deleted automatically due to cascade)
    await prisma.studentApplication.delete({
      where: { id: applicationId },
    });

    return { message: 'আবেদন সফলভাবে মুছে ফেলা হয়েছে' };
  },
};
