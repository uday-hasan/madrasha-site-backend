import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';

export const qaService = {
  // Get all published questions with answers and replies (public)
  getAllPublished: async () => {
    return prisma.question.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        answers: {
          include: {
            replies: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Get all questions (admin only)
  getAll: async () => {
    return prisma.question.findMany({
      include: {
        answers: {
          include: {
            replies: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Get question by ID with all answers and replies
  getById: async (id: string) => {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            replies: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!question) {
      throw new AppError('প্রশ্ন পাওয়া যায়নি', 404);
    }

    return question;
  },

  // Create new question (public - creates as draft)
  createQuestion: async (data: { question: string; category: string; authorName: string }) => {
    return prisma.question.create({
      data: {
        question: data.question,
        category: data.category,
        authorName: data.authorName,
        status: 'DRAFT',
      },
    });
  },

  // Update question (admin)
  updateQuestion: async (
    id: string,
    data: {
      question?: string;
      category?: string;
      authorName?: string;
      isResolved?: boolean;
    },
  ) => {
    const existing = await prisma.question.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('প্রশ্ন পাওয়া যায়নি', 404);
    }

    return prisma.question.update({
      where: { id },
      data,
      include: {
        answers: {
          include: {
            replies: true,
          },
        },
      },
    });
  },

  // Publish question (admin)
  publishQuestion: async (id: string) => {
    const existing = await prisma.question.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('প্রশ্ন পাওয়া যায়নি', 404);
    }

    return prisma.question.update({
      where: { id },
      data: { status: 'PUBLISHED' },
      include: {
        answers: {
          include: {
            replies: true,
          },
        },
      },
    });
  },

  // Unpublish question (admin)
  unpublishQuestion: async (id: string) => {
    const existing = await prisma.question.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('প্রশ্ন পাওয়া যায়নি', 404);
    }

    return prisma.question.update({
      where: { id },
      data: { status: 'DRAFT' },
      include: {
        answers: {
          include: {
            replies: true,
          },
        },
      },
    });
  },

  // Delete question (admin)
  deleteQuestion: async (id: string) => {
    const existing = await prisma.question.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError('প্রশ্ন পাওয়া যায়নি', 404);
    }

    return prisma.question.delete({
      where: { id },
    });
  },

  // Add answer to question (admin)
  addAnswer: async (
    questionId: string,
    data: {
      content: string;
      authorName: string;
      authorRole: 'ADMIN' | 'TEACHER' | 'USER';
    },
  ) => {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new AppError('প্রশ্ন পাওয়া যায়নি', 404);
    }

    return prisma.answer.create({
      data: {
        content: data.content,
        authorName: data.authorName,
        authorRole: data.authorRole,
        questionId,
      },
      include: {
        replies: true,
      },
    });
  },

  // Update answer (admin)
  updateAnswer: async (
    answerId: string,
    data: {
      content?: string;
      authorName?: string;
      authorRole?: 'ADMIN' | 'TEACHER' | 'USER';
    },
  ) => {
    const existing = await prisma.answer.findUnique({
      where: { id: answerId },
    });

    if (!existing) {
      throw new AppError('উত্তর পাওয়া যায়নি', 404);
    }

    return prisma.answer.update({
      where: { id: answerId },
      data,
    });
  },

  // Delete answer (admin)
  deleteAnswer: async (answerId: string) => {
    const existing = await prisma.answer.findUnique({
      where: { id: answerId },
    });

    if (!existing) {
      throw new AppError('উত্তর পাওয়া যায়নি', 404);
    }

    return prisma.answer.delete({
      where: { id: answerId },
    });
  },

  // Add reply to answer (public - can be by anyone)
  addReply: async (
    answerId: string,
    data: {
      content: string;
      authorName: string;
      authorRole?: 'ADMIN' | 'TEACHER' | 'USER';
    },
  ) => {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    });

    if (!answer) {
      throw new AppError('উত্তর পাওয়া যায়নি', 404);
    }

    return prisma.reply.create({
      data: {
        content: data.content,
        authorName: data.authorName,
        authorRole: data.authorRole || 'USER',
        answerId,
      },
    });
  },

  // Delete reply (admin)
  deleteReply: async (replyId: string) => {
    const existing = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!existing) {
      throw new AppError('মন্তব্য পাওয়া যায়নি', 404);
    }

    return prisma.reply.delete({
      where: { id: replyId },
    });
  },
};
