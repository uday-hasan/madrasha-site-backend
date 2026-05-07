import { prisma } from '../../config/database';
import { AppError } from '../../utils/AppError';

export interface ContactPageData {
  address: string;
  city: string;
  district: string;
  phone: string[];
  email: string[];
  officeHours: string;
  googleMapsUrl?: string | null;
}

// Default contact data
const defaultContactData: ContactPageData = {
  address: 'মাদরাসার ঠিকানা',
  city: 'শহর',
  district: 'জেলা',
  phone: ['01723567282'],
  email: ['info@darularqam.edu.bd'],
  officeHours: 'সকাল ৮টা - বিকেল ৫টা',
  googleMapsUrl: undefined,
};

export const contactService = {
  // Get contact page data
  async getContactData(): Promise<ContactPageData> {
    let contactPage = await prisma.contactPage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!contactPage) {
      contactPage = await prisma.contactPage.create({
        data: defaultContactData,
      });
    }

    return {
      address: contactPage.address,
      city: contactPage.city,
      district: contactPage.district,
      phone: contactPage.phone as string[],
      email: contactPage.email as string[],
      officeHours: contactPage.officeHours,
      googleMapsUrl: contactPage.googleMapsUrl,
    };
  },

  // Update contact page data (Admin only)
  async updateContactData(data: Partial<ContactPageData>) {
    const existing = await prisma.contactPage.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!existing) {
      throw new AppError('যোগাযোগ পৃষ্ঠা পাওয়া যায়নি', 404);
    }

    const updated = await prisma.contactPage.update({
      where: { id: existing.id },
      data: {
        address: data.address || existing.address,
        city: data.city || existing.city,
        district: data.district || existing.district,
        phone: data.phone || existing.phone,
        email: data.email || existing.email,
        officeHours: data.officeHours || existing.officeHours,
        googleMapsUrl:
          data.googleMapsUrl !== undefined ? data.googleMapsUrl : existing.googleMapsUrl,
      },
    });

    return {
      address: updated.address,
      city: updated.city,
      district: updated.district,
      phone: updated.phone as string[],
      email: updated.email as string[],
      officeHours: updated.officeHours,
      googleMapsUrl: updated.googleMapsUrl,
    };
  },
};
