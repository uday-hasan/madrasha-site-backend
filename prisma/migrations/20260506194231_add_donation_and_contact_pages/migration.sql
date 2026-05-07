-- CreateTable
CREATE TABLE "donation_pages" (
    "id" TEXT NOT NULL,
    "pageTitle" TEXT NOT NULL DEFAULT 'মাদরাসায় দান করুন',
    "pageDescription" TEXT NOT NULL DEFAULT 'আপনার দান মাদরাসার উন্নয়নে সহায়তা করবে',
    "bannerText" TEXT NOT NULL DEFAULT 'মাদরাসায় দান করুন',
    "quranicVerse" JSONB NOT NULL DEFAULT '{"arabic": "", "bangla": "", "reference": ""}',
    "categories" JSONB NOT NULL DEFAULT '[]',
    "methods" JSONB NOT NULL DEFAULT '[]',
    "contactForDonation" JSONB NOT NULL DEFAULT '{"phone": "", "email": "", "note": ""}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_pages" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "phone" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "officeHours" TEXT NOT NULL,
    "googleMapsUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pages_pkey" PRIMARY KEY ("id")
);
