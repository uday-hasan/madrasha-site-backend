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
          content:
            'আগামী শিক্ষাবর্ষে ভর্তি শুরু হয়েছে। আগ্রহী ছাত্র-ছাত্রীরা অফিসে যোগাযোগ করুন।',
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
