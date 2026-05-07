import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';

export interface DonationCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface DonationMethod {
  id: string;
  type: 'bank' | 'mobile' | 'cash';
  name: string;
  details: Record<string, string>;
}

export interface QuranicVerse {
  arabic: string;
  bangla: string;
  reference: string;
}

export interface DonationPageData {
  id?: string;
  pageTitle: string;
  pageDescription: string;
  bannerText: string;
  quranicVerse: QuranicVerse | Record<string, string>;
  categories: DonationCategory[] | Record<string, unknown>[];
  methods: DonationMethod[] | Record<string, unknown>[];
  contactForDonation:
    | {
        phone: string;
        email: string;
        note: string;
      }
    | Record<string, string>;
}

// Default data for initial setup
const defaultData: DonationPageData = {
  pageTitle: 'মাদরাসায় দান করুন',
  pageDescription: 'আপনার দান মাদরাসার উন্নয়নে সহায়তা করবে',
  bannerText: 'মাদরাসায় দান করুন',
  quranicVerse: {
    arabic:
      'مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ وَلَهُ أَجْرٌ كَرِيمٌ',
    bangla:
      'তোমরা আল্লাহর পথে খরচ করো... আল্লাহ তা বৃদ্ধি করে দেবেন। আল্লাহ সর্বোচ্চ ক্ষমতাবান, সর্বজ্ঞ।',
    reference: 'সূরা আল-বাকারা: ২৪৫',
  },
  categories: [
    {
      id: '1',
      title: 'জাকাত',
      description: 'যাকাত ফান্ডে দান করুন',
      icon: 'Zakat',
    },
    {
      id: '2',
      title: 'ছাত্র বৃত্তি',
      description: 'দরিদ্র ছাত্রদের পড়াশোনায় সহায়তা করুন',
      icon: 'Scholarship',
    },
    {
      id: '3',
      title: 'মাদরাসা উন্নয়ন',
      description: 'মাদরাসার অবকাঠামো উন্নয়নে দান করুন',
      icon: 'Building',
    },
  ],
  methods: [
    {
      id: '1',
      type: 'bank',
      name: 'ব্যাংক ট্রান্সফার',
      details: {
        description: 'সরাসরি ব্যাংকে টাকা জমা দিন',
        accountNumber: 'ব্যাংক অ্যাকাউন্ট তথ্য',
      },
    },
    {
      id: '2',
      type: 'mobile',
      name: 'মোবাইল ব্যাংকিং',
      details: {
        description: 'বিকাশ/নগদে পাঠান',
        number: '01723567282',
      },
    },
  ],
  contactForDonation: {
    phone: '01723567282',
    email: 'info@darularqam.edu.bd',
    note: 'যোগাযোগের সময়: সকাল ৮টা - বিকেল ৫টা',
  },
};

export const donationService = {
  // Get donation page data
  async getDonationData(): Promise<DonationPageData> {
    let donationPage = await prisma.donationPage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!donationPage) {
      donationPage = await prisma.donationPage.create({
        data: {
          pageTitle: defaultData.pageTitle,
          pageDescription: defaultData.pageDescription,
          bannerText: defaultData.bannerText,
          quranicVerse: defaultData.quranicVerse as any,
          categories: defaultData.categories as any,
          methods: defaultData.methods as any,
          contactForDonation: defaultData.contactForDonation as any,
        },
      });
    }

    return {
      id: donationPage.id,
      pageTitle: donationPage.pageTitle,
      pageDescription: donationPage.pageDescription,
      bannerText: donationPage.bannerText,
      quranicVerse: donationPage.quranicVerse as any,
      categories: donationPage.categories as any,
      methods: donationPage.methods as any,
      contactForDonation: donationPage.contactForDonation as any,
    };
  },

  // Update donation page data (Admin only)
  async updateDonationData(data: Partial<DonationPageData>) {
    const existing = await prisma.donationPage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!existing) {
      throw new AppError('দান পৃষ্ঠা পাওয়া যায়নি', 404);
    }

    const updated = await prisma.donationPage.update({
      where: { id: existing.id },
      data: {
        pageTitle: data.pageTitle || existing.pageTitle,
        pageDescription: data.pageDescription || existing.pageDescription,
        bannerText: data.bannerText || existing.bannerText,
        quranicVerse: data.quranicVerse ? (data.quranicVerse as any) : existing.quranicVerse,
        categories: data.categories ? (data.categories as any) : existing.categories,
        methods: data.methods ? (data.methods as any) : existing.methods,
        contactForDonation: data.contactForDonation
          ? (data.contactForDonation as any)
          : existing.contactForDonation,
      },
    });

    return {
      id: updated.id,
      pageTitle: updated.pageTitle,
      pageDescription: updated.pageDescription,
      bannerText: updated.bannerText,
      quranicVerse: updated.quranicVerse as any,
      categories: updated.categories as any,
      methods: updated.methods as any,
      contactForDonation: updated.contactForDonation as any,
    };
  },
};
