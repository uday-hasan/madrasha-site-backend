/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '../src/config/database';

async function seedAdmissionData() {
  try {
    console.log('Seeding admission data...');

    // Seed admission settings
    const _settings = await prisma.admissionSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        isOpen: true,
        session: '२०२५-२०२६',
        startDate: '२०२५ सालेर १ जनवरी',
        endDate: '२०२५ सालेर ३१ मार्च',
        officeHoursStart: 'सकाल ८टा',
        officeHoursEnd: 'बिकेल ४टा',
        officeHoursDays: 'शनि - बृहस्पति',
      },
    });
    console.log('✓ Admission settings seeded');

    // Seed admission processes
    const _processes = await Promise.all([
      prisma.admissionProcess.create({
        data: {
          step: 'अफिसमा आएर भर्ति फरम संगह्रह गर्नुहोस् (फरमको मूल्य: ५० टाका)',
          displayOrder: 0,
          isActive: true,
        },
      }),
      prisma.admissionProcess.create({
        data: {
          step: 'आवश्यक कागजपत्र संहित फरम पूरा गर्नुहोस्',
          displayOrder: 1,
          isActive: true,
        },
      }),
      prisma.admissionProcess.create({
        data: {
          step: 'निर्धारित मितिमा भर्ति परीक्षामा भाग लिनुहोस्',
          displayOrder: 2,
          isActive: true,
        },
      }),
      prisma.admissionProcess.create({
        data: {
          step: 'परिणाम प्रकाशन पछि भर्ति निश्चित गर्नुहोस्',
          displayOrder: 3,
          isActive: true,
        },
      }),
      prisma.admissionProcess.create({
        data: {
          step: 'भर्ति शुल्क तिर्नुहोस् र कक्षा शुरु गर्नुहोस्',
          displayOrder: 4,
          isActive: true,
        },
      }),
    ]);
    console.log('✓ Admission processes seeded');

    // Seed important dates
    const _dates = await Promise.all([
      prisma.admissionImportantDate.create({
        data: {
          event: 'भर्ति फरम वितरण शुरु',
          date: '१ जनवरी २०२५',
          displayOrder: 0,
          isActive: true,
        },
      }),
      prisma.admissionImportantDate.create({
        data: {
          event: 'फरम जमा गर्ने अन्तिम मिति',
          date: '२० मार्च २०२५',
          displayOrder: 1,
          isActive: true,
        },
      }),
      prisma.admissionImportantDate.create({
        data: {
          event: 'भर्ति परीक्षा',
          date: '२५ मार्च २०२५',
          displayOrder: 2,
          isActive: true,
        },
      }),
      prisma.admissionImportantDate.create({
        data: {
          event: 'परिणाम प्रकाशन',
          date: '२७ मार्च २०२५',
          displayOrder: 3,
          isActive: true,
        },
      }),
      prisma.admissionImportantDate.create({
        data: {
          event: 'कक्षा शुरु',
          date: '१ अप्रिल २०२५',
          displayOrder: 4,
          isActive: true,
        },
      }),
    ]);
    console.log('✓ Important dates seeded');

    console.log('✓ All admission data seeded successfully!');
  } catch (error) {
    console.error('Error seeding admission data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmissionData();
