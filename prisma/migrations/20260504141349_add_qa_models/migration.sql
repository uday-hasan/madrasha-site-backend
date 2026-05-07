/*
  Warnings:

  - You are about to drop the column `aboutSummary` on the `home_pages` table. All the data in the column will be lost.
  - You are about to drop the column `bannerImage` on the `home_pages` table. All the data in the column will be lost.
  - You are about to drop the column `featuredNoticesLimit` on the `home_pages` table. All the data in the column will be lost.
  - You are about to drop the column `galleryPreviewLimit` on the `home_pages` table. All the data in the column will be lost.
  - You are about to drop the column `marqueeText` on the `home_pages` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AuthorRole" AS ENUM ('ADMIN', 'TEACHER', 'USER');

-- AlterTable
ALTER TABLE "home_pages" DROP COLUMN "aboutSummary",
DROP COLUMN "bannerImage",
DROP COLUMN "featuredNoticesLimit",
DROP COLUMN "galleryPreviewLimit",
DROP COLUMN "marqueeText";

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "status" "QuestionStatus" NOT NULL DEFAULT 'DRAFT',
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" "AuthorRole" NOT NULL DEFAULT 'ADMIN',
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replies" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" "AuthorRole" NOT NULL DEFAULT 'USER',
    "answerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
