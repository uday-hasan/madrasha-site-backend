import { PrismaClient } from '../src/generated/prisma/client';

async function seedQA(prisma: PrismaClient) {
  console.log('🌱 Seeding Q&A data...');

  // Check if Q&A data already exists
  const existingQuestions = await prisma.question.count();
  if (existingQuestions > 0) {
    console.log(`ℹ️  Q&A data already exists (${existingQuestions} questions)`);
    return;
  }

  // Create published questions
  const q1 = await prisma.question.create({
    data: {
      question:
        'ফজরের নামাযের পর সূর্যোদয় পর্যন্ত মসজিদে বসে থাকার ফযীলত কী? এটি কি ইশরাকের নামাযের সাথে সম্পর্কিত?',
      category: 'নামায ও ইবাদত',
      authorName: 'আব্দুল্লাহ আল মামুন',
      status: 'PUBLISHED',
      isResolved: true,
    },
  });

  // Add answer to q1
  const a1 = await prisma.answer.create({
    data: {
      content: `রাসূলুল্লাহ (সা.) বলেছেন, "যে ব্যক্তি ফজরের নামায জামাআতে আদায় করে সূর্যোদয় পর্যন্ত বসে আল্লাহর যিকর করে, তারপর দুই রাকআত (ইশরাক) নামায আদায় করে, তার জন্য একটি পূর্ণ হজ্জ ও উমরার সওয়াব রয়েছে।" (তিরমিযী: ৫৮৬)

সুতরাং, ফজরের পর মসজিদে বসে কুরআন তিলাওয়াত ও যিকর করা অত্যন্ত ফযীলতপূর্ণ আমল। সূর্যোদয়ের ১৫-২০ মিনিট পর ইশরাকের নামায আদায় করবেন।`,
      authorName: 'মাওলানা আব্দুল করিম',
      authorRole: 'ADMIN',
      questionId: q1.id,
    },
  });

  // Add replies to a1
  await prisma.reply.create({
    data: {
      content: 'জাযাকাল্লাহু খাইরান হুযুর। সূর্যোদয়ের ঠিক কত মিনিট পর ইশরাকের নামায পড়া উচিত?',
      authorName: 'আব্দুল্লাহ আল মামুন',
      authorRole: 'USER',
      answerId: a1.id,
    },
  });

  await prisma.reply.create({
    data: {
      content:
        'সূর্যোদয়ের প্রায় ১৫-২০ মিনিট পর যখন সূর্য একটু উপরে ওঠে তখন ইশরাকের নামায পড়া উত্তম। নিষিদ্ধ সময় (সূর্যোদয়ের সময়) পার হওয়ার পরই পড়া যাবে।',
      authorName: 'মাওলানা আব্দুল করিম',
      authorRole: 'ADMIN',
      answerId: a1.id,
    },
  });

  // Create another published question
  const q2 = await prisma.question.create({
    data: {
      question:
        'যাকাত হিসাব করার সহজ নিয়ম কী? স্বর্ণালংকারের উপর কি যাকাত ফরয? আমার কাছে ১০ ভরি স্বর্ণ আছে।',
      category: 'যাকাত ও সদকা',
      authorName: 'ফাতেমা বিনতে খালেদ',
      status: 'PUBLISHED',
      isResolved: true,
    },
  });

  // Add answer to q2
  await prisma.answer.create({
    data: {
      content: `যাকাত ফরয হওয়ার জন্য নিসাব পরিমাণ সম্পদ থাকতে হবে। স্বর্ণের ক্ষেত্রে নিসাব হলো সাড়ে সাত (৭.৫) ভরি। আপনার কাছে ১০ ভরি স্বর্ণ থাকলে অবশ্যই যাকাত ফরয।

**হিসাবের নিয়ম:**
- স্বর্ণের বর্তমান বাজারমূল্য নির্ধারণ করুন
- মোট মূল্যের ২.৫% (চল্লিশ ভাগের এক ভাগ) যাকাত দিতে হবে
- চন্দ্র বছর পূর্ণ হলে যাকাত আদায় করতে হবে

উদাহরণ: ১০ ভরি × বর্তমান দর = মোট মূল্য × ২.৫% = যাকাতের পরিমাণ।`,
      authorName: 'মুফতি রহমতুল্লাহ',
      authorRole: 'TEACHER',
      questionId: q2.id,
    },
  });

  // Create a draft question
  await prisma.question.create({
    data: {
      question: 'অনলাইনে ব্যবসা করা কি জায়েয? ড্রপশিপিং ব্যবসার ব্যাপারে ইসলামের বিধান কী?',
      category: 'লেনদেন ও ব্যবসা',
      authorName: 'কামরুল হাসান',
      status: 'DRAFT',
      isResolved: false,
    },
  });

  // Create another draft question
  await prisma.question.create({
    data: {
      question:
        'মহিলাদের জন্য তারাবীহের নামায ঘরে পড়া উত্তম নাকি মসজিদে? একা পড়লে কত রাকআত পড়তে হবে?',
      category: 'নামায ও ইবাদত',
      authorName: 'রহিমা খাতুন',
      status: 'DRAFT',
      isResolved: false,
    },
  });

  console.log('✅ Q&A data seeded successfully!');
}

export default seedQA;
