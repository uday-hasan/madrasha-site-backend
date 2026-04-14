import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// ================================
// DATABASE SEEDER
// Creates default admin user, sample notices, gallery items,
// and home page content.
//
// Run: npx prisma db seed
// Or:  bun prisma/seed.ts
// ================================

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // ---- ADMIN USER ----
  const adminEmail = 'admin@darululoom.edu.bd';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123456';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // ---- HOME PAGE CONTENT ----
  const existingHome = await prisma.homePage.findFirst();

  if (!existingHome) {
    await prisma.homePage.create({
      data: {
        heroSlides: [
          {
            title: 'মাদ্রাসা দারুল আরকাম',
            subtitle: 'ইসলামিক শিক্ষার আলো',
            description: 'কুরআন ও সুন্নাহর আলোকে জ্ঞান অর্জন করুন',
            imageUrl: '/uploads/images/hero-1.jpg',
          },
        ],
        stats: [
          { label: 'শিক্ষার্থী', value: '500', suffix: '+', icon: 'users' },
          { label: 'শিক্ষক', value: '30', suffix: '+', icon: 'chalkboard-teacher' },
          { label: 'বছর', value: '25', suffix: '+', icon: 'calendar' },
          { label: 'বিভাগ', value: '10', suffix: '', icon: 'book' },
        ],
      },
    });
    console.log('✅ Home page content created');
  } else {
    console.log('ℹ️  Home page content already exists');
  }

  // ---- SAMPLE NOTICES ----
  const noticesCount = await prisma.notice.count();

  if (noticesCount === 0) {
    await prisma.notice.createMany({
      data: [
        {
          title: 'ভর্তি বিজ্ঞপ্তি ২০২৬',
          content: 'আগামী শিক্ষাবর্ষে ভর্তি শুরু হয়েছে। আগ্রহী ছাত্র-ছাত্রীরা অফিসে যোগাযোগ করুন।',
          category: 'admission',
          featured: true,
          slug: 'admission-notice-2026',
        },
        {
          title: 'বার্ষিক পরীক্ষার সময়সূচী',
          content: 'আগামী মাসে বার্ষিক পরীক্ষা অনুষ্ঠিত হবে। বিস্তারিত সময়সূচী দেখুন।',
          category: 'exam',
          featured: true,
          slug: 'annual-exam-schedule-2026',
        },
        {
          title: 'বিশেষ দোয়া মাহফিল',
          content: 'শুক্রবার জুমার নামাজের পর বিশেষ দোয়া মাহফিল অনুষ্ঠিত হবে।',
          category: 'event',
          featured: false,
          slug: 'special-dua-mahfil',
        },
      ],
    });
    console.log('✅ Sample notices created');
  } else {
    console.log('ℹ️  Notices already exist');
  }

  // ---- DEPARTMENTS ----
  const departmentsCount = await prisma.department.count();

  if (departmentsCount === 0) {
    await prisma.department.createMany({
      data: [
        {
          name: 'নূরানী কিন্ডারগার্টেন',
          slug: 'nurani',
          description:
            'শিশুদের প্রাথমিক ইসলামী শিক্ষার জন্য নূরানী পদ্ধতিতে কোরআন শিক্ষা ও প্রাথমিক বিষয়সমূহ পাঠদান করা হয়। বাংলা, ইংরেজি ও গণিতের সমন্বয়ে একটি পূর্ণাঙ্গ প্রাথমিক শিক্ষা প্রদান করা হয়।',
          duration: '২ বছর',
          subjects: ['নূরানী কায়দা', 'আমপারা', 'ছোট সূরা', 'দুআ-কালাম', 'বাংলা', 'ইংরেজি', 'গণিত'],
          headTeacher: 'মোঃ আব্দুল হালিম',
          totalStudents: 30,
          displayOrder: 1,
          isActive: true,
        },
        {
          name: 'নাজেরা বিভাগ',
          slug: 'nazera',
          description:
            'সঠিক উচ্চারণ ও তাজবিদ সহকারে কুরআন তেলাওয়াত শেখার বিভাগ। এই বিভাগ সম্পন্ন করে শিক্ষার্থীরা হিফজ বিভাগে যেতে পারে।',
          duration: '১ বছর',
          subjects: ['কোরআন নাজেরা', 'তাজবিদ', 'মুখস্থ সূরা', 'ফরজে আইন মাসায়েল'],
          headTeacher: 'হাফেজ মোঃ জাহিদুল ইসলাম',
          totalStudents: 25,
          displayOrder: 2,
          isActive: true,
        },
        {
          name: 'হিফজুল কোরআন বিভাগ',
          slug: 'hifz',
          description:
            'পবিত্র কুরআনুল কারীম সম্পূর্ণ মুখস্থ করার বিভাগ। অভিজ্ঞ হাফেজ উস্তাদের তত্ত্বাবধানে বিশেষ পদ্ধতিতে হিফজ সম্পন্ন করা হয়।',
          duration: '৩-৫ বছর',
          subjects: ['হিফজুল কোরআন', 'তাজবিদ', 'দৈনিক সবক ও সবকী দাওর'],
          headTeacher: 'হাফেজ মোঃ জাহিদুল ইসলাম',
          totalStudents: 20,
          displayOrder: 3,
          isActive: true,
        },
        {
          name: 'প্রভাতী ও বৈকালীন মক্তব বিভাগ',
          slug: 'maktab',
          description:
            'শিশুদের প্রাথমিক ইসলামিক শিক্ষার বিভাগ। সকাল ও বিকেলে দুটি শিফটে পাঠদান করা হয়। আলিফ-বা-তা থেকে শুরু করে প্রাথমিক ইসলামিক জ্ঞান প্রদান করা হয়।',
          duration: '১ বছর',
          subjects: ['আলিফ-বা-তা', 'নূরানী কায়দা', 'আমপারা', 'প্রাথমিক দুআ-কালাম'],
          headTeacher: 'মোঃ আব্দুর রহিম',
          totalStudents: 15,
          displayOrder: 4,
          isActive: true,
        },
      ],
    });
    console.log('✅ 4 departments created');
  } else {
    console.log(`ℹ️  ${departmentsCount} departments already exist`);
  }

  // ---- SITE SETTINGS ----
  const settingsCount = await prisma.siteSettings.count();

  if (settingsCount === 0) {
    await prisma.siteSettings.createMany({
      data: [
        // Contact Info
        {
          key: 'contact_phone',
          value: '01723567282',
          category: 'contact',
          description: 'যোগাযোগ ফোন নম্বর',
          isPublic: true,
        },
        {
          key: 'contact_email',
          value: 'info@darularqam.edu.bd',
          category: 'contact',
          description: 'ইমেইল ঠিকানা',
          isPublic: true,
        },
        {
          key: 'contact_address',
          value: 'পূর্বধলা, নেত্রকোনা, ময়মনসিংহ, বাংলাদেশ',
          category: 'contact',
          description: 'ঠিকানা',
          isPublic: true,
        },
        {
          key: 'contact_map_url',
          value: 'https://maps.google.com/?q=24.123456,90.123456',
          category: 'contact',
          description: 'ম্যাপ URL',
          isPublic: true,
        },

        // About Page
        {
          key: 'about_title',
          value: 'মাদরাসা দারুল আরকাম আল ইসলামিয়া',
          category: 'about',
          description: 'প্রতিষ্ঠানের নাম',
          isPublic: true,
        },
        {
          key: 'about_description',
          value:
            'মাদরাসা দারুল আরকাম আল ইসলামিয়া ২০২৪ সাল থেকে ইসলামী শিক্ষার আলো ছড়িয়ে দিচ্ছে। আমাদের লক্ষ্য কুরআন, হাদিস ও নৈতিক শিক্ষার সমন্বয়ে আলোকিত প্রজন্ম গঠন করা।',
          category: 'about',
          description: 'সংক্ষিপ্ত বিবরণ',
          isPublic: true,
        },
        {
          key: 'about_mission',
          value: 'কুরআন ও সুন্নাহর আলোকে প্রজন্ম গঠন',
          category: 'about',
          description: 'লক্ষ্য',
          isPublic: true,
        },
        {
          key: 'about_vision',
          value: 'ইলম ও আমলের সমন্বয়ে আদর্শ মুসলিম সমাজ বিনির্মাণ',
          category: 'about',
          description: 'ভিশন',
          isPublic: true,
        },
        {
          key: 'about_established',
          value: '2024',
          category: 'about',
          description: 'প্রতিষ্ঠার সাল',
          isPublic: true,
        },
        {
          key: 'about_founder',
          value: 'মাওলানা আব্দুল্লাহ আল মামুন',
          category: 'about',
          description: 'প্রতিষ্ঠাতা',
          isPublic: true,
        },

        // Donation Page
        {
          key: 'donation_title',
          value: 'মাদরাসায় দান করুন',
          category: 'donation',
          description: 'দান পেজ শিরোনাম',
          isPublic: true,
        },
        {
          key: 'donation_description',
          value:
            'আপনার দান মাদরাসার উন্নয়নে ও ছাত্রদের শিক্ষায় সহায়তা করবে। দান করুন, সওয়াব লাভ করুন।',
          category: 'donation',
          description: 'দান পেজ বিবরণ',
          isPublic: true,
        },
        {
          key: 'donation_bank_name',
          value: 'ইসলামী ব্যাংক বাংলাদেশ লিমিটেড',
          category: 'donation',
          description: 'ব্যাংকের নাম',
          isPublic: true,
        },
        {
          key: 'donation_account_name',
          value: 'মাদরাসা দারুল আরকাম আল ইসলামিয়া',
          category: 'donation',
          description: 'অ্যাকাউন্ট নাম',
          isPublic: true,
        },
        {
          key: 'donation_account_number',
          value: '1234567890123',
          category: 'donation',
          description: 'অ্যাকাউন্ট নম্বর',
          isPublic: true,
        },
        {
          key: 'donation_branch',
          value: 'পূর্বধলা শাখা',
          category: 'donation',
          description: 'শাখা',
          isPublic: true,
        },
        {
          key: 'donation_routing_number',
          value: '125123456',
          category: 'donation',
          description: 'রাউটিং নম্বর',
          isPublic: true,
        },
        {
          key: 'donation_bkash_number',
          value: '01723567282',
          category: 'donation',
          description: 'বিকাশ নম্বর',
          isPublic: true,
        },
        {
          key: 'donation_nagad_number',
          value: '01723567282',
          category: 'donation',
          description: 'নগদ নম্বর',
          isPublic: true,
        },
      ],
    });
    console.log('✅ Site settings created');
  } else {
    console.log(`ℹ️  ${settingsCount} site settings already exist`);
  }

  console.log('✅ Database seeding complete!');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
