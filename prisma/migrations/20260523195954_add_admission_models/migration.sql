-- CreateTable
CREATE TABLE "admission_settings" (
    "id" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "session" TEXT NOT NULL DEFAULT '২০২৫-২০২৬',
    "startDate" TEXT NOT NULL DEFAULT '২০২৫ সালের ১ জানুয়ারি',
    "endDate" TEXT NOT NULL DEFAULT '२०२५ সালের ३१ মার্চ',
    "officeHoursStart" TEXT NOT NULL DEFAULT 'সকাল ৮টা',
    "officeHoursEnd" TEXT NOT NULL DEFAULT 'বিকেল ৪টা',
    "officeHoursDays" TEXT NOT NULL DEFAULT 'শনি - বৃহস্পতি',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_processes" (
    "id" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_requirements" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "minimumAge" TEXT NOT NULL,
    "minimumQualification" TEXT NOT NULL,
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fees" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_important_dates" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_important_dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "admission_requirements" ADD CONSTRAINT "admission_requirements_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
