-- AlterTable
ALTER TABLE "home_pages" ADD COLUMN     "aboutSummary" TEXT,
ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "featuredNoticesLimit" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "galleryPreviewLimit" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "marqueeText" TEXT;

-- AlterTable
ALTER TABLE "notices" ADD COLUMN     "attachmentUrl" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isImportant" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "headTeacher" TEXT,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_slug_key" ON "departments"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");
