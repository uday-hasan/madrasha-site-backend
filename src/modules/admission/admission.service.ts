import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';

export const admissionService = {
  // ============ ADMISSION SETTINGS ============
  getSettings: async () => {
    return prisma.admissionSettings.findFirst();
  },

  updateSettings: async (data: {
    isOpen?: boolean;
    session?: string;
    startDate?: string;
    endDate?: string;
    officeHoursStart?: string;
    officeHoursEnd?: string;
    officeHoursDays?: string;
  }) => {
    let settings = await prisma.admissionSettings.findFirst();

    if (!settings) {
      settings = await prisma.admissionSettings.create({
        data: {
          isOpen: data.isOpen ?? true,
          session: data.session ?? '२०२५-२०२६',
          startDate: data.startDate ?? '२०२५ সালের ১ জানুয়ারি',
          endDate: data.endDate ?? '२०२५ সালের ३१ মার্চ',
          officeHoursStart: data.officeHoursStart ?? 'সকাল ৮টা',
          officeHoursEnd: data.officeHoursEnd ?? 'বিকেল ৪টা',
          officeHoursDays: data.officeHoursDays ?? 'শনি - বৃহস্পতি',
        },
      });
    } else {
      settings = await prisma.admissionSettings.update({
        where: { id: settings.id },
        data,
      });
    }

    return settings;
  },

  // ============ ADMISSION PROCESSES ============
  getProcesses: async () => {
    return prisma.admissionProcess.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllProcesses: async () => {
    return prisma.admissionProcess.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  createProcess: async (data: { step: string; displayOrder?: number; isActive?: boolean }) => {
    return prisma.admissionProcess.create({
      data: {
        step: data.step,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  updateProcess: async (
    id: string,
    data: Partial<{
      step: string;
      displayOrder: number;
      isActive: boolean;
    }>,
  ) => {
    const existing = await prisma.admissionProcess.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('প্রক্রিয়া পাওয়া যায়নি', 404);
    }

    return prisma.admissionProcess.update({
      where: { id },
      data,
    });
  },

  deleteProcess: async (id: string) => {
    return prisma.admissionProcess.delete({
      where: { id },
    });
  },

  // ============ ADMISSION REQUIREMENTS ============
  getRequirements: async (departmentId?: string) => {
    return prisma.admissionRequirement.findMany({
      where: {
        isActive: true,
        ...(departmentId && { departmentId }),
      },
      include: { department: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllRequirements: async (departmentId?: string) => {
    return prisma.admissionRequirement.findMany({
      where: {
        ...(departmentId && { departmentId }),
      },
      include: { department: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getRequirementById: async (id: string) => {
    const requirement = await prisma.admissionRequirement.findUnique({
      where: { id },
      include: { department: true },
    });

    if (!requirement) {
      throw new AppError('প্রয়োজনীয়তা পাওয়া যায়নি', 404);
    }

    return requirement;
  },

  createRequirement: async (data: {
    departmentId: string;
    minimumAge: string;
    minimumQualification: string;
    documents?: string[];
    fees: string;
    seats: number;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.admissionRequirement.create({
      data: {
        departmentId: data.departmentId,
        minimumAge: data.minimumAge,
        minimumQualification: data.minimumQualification,
        documents: data.documents ?? [],
        fees: data.fees,
        seats: data.seats,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
      include: { department: true },
    });
  },

  updateRequirement: async (
    id: string,
    data: Partial<{
      departmentId: string;
      minimumAge: string;
      minimumQualification: string;
      documents: string[];
      fees: string;
      seats: number;
      displayOrder: number;
      isActive: boolean;
    }>,
  ) => {
    const existing = await prisma.admissionRequirement.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('প্রয়োজনীয়তা পাওয়া যায়নি', 404);
    }

    return prisma.admissionRequirement.update({
      where: { id },
      data,
      include: { department: true },
    });
  },

  deleteRequirement: async (id: string) => {
    return prisma.admissionRequirement.delete({
      where: { id },
    });
  },

  // ============ ADMISSION IMPORTANT DATES ============
  getImportantDates: async () => {
    return prisma.admissionImportantDate.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  getAllImportantDates: async () => {
    return prisma.admissionImportantDate.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  },

  getImportantDateById: async (id: string) => {
    const date = await prisma.admissionImportantDate.findUnique({
      where: { id },
    });

    if (!date) {
      throw new AppError('তারিখ পাওয়া যায়নি', 404);
    }

    return date;
  },

  createImportantDate: async (data: {
    event: string;
    date: string;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    return prisma.admissionImportantDate.create({
      data: {
        event: data.event,
        date: data.date,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    });
  },

  updateImportantDate: async (
    id: string,
    data: Partial<{
      event: string;
      date: string;
      displayOrder: number;
      isActive: boolean;
    }>,
  ) => {
    const existing = await prisma.admissionImportantDate.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('তারিখ পাওয়া যায়নি', 404);
    }

    return prisma.admissionImportantDate.update({
      where: { id },
      data,
    });
  },

  deleteImportantDate: async (id: string) => {
    return prisma.admissionImportantDate.delete({
      where: { id },
    });
  },

  // ============ GET FULL ADMISSION INFO ============
  getFullAdmissionInfo: async () => {
    const [settings, processes, requirements, importantDates] = await Promise.all([
      prisma.admissionSettings.findFirst(),
      prisma.admissionProcess.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.admissionRequirement.findMany({
        where: { isActive: true },
        include: { department: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.admissionImportantDate.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

    return {
      settings: settings || {
        isOpen: true,
        session: '२०२५-२०२६',
        startDate: '२०२५ সালের १ জানুয়ারি',
        endDate: '२०२५ সালের ३१ মার্চ',
        officeHoursStart: 'সকাল ৮টা',
        officeHoursEnd: 'বিকেল ४টা',
        officeHoursDays: 'শনি - বৃহস্পতি',
      },
      processes: processes.map((p) => p.step),
      requirements: requirements.map((r) => ({
        department: { name: r.department.name },
        minimumAge: r.minimumAge,
        minimumQualification: r.minimumQualification,
        documents: r.documents,
        fees: r.fees,
        seats: r.seats,
      })),
      importantDates: importantDates.map((d) => ({
        event: d.event,
        date: d.date,
      })),
    };
  },
};
