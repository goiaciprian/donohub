import { PrismaService } from '@/Prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DonationStatus, DonationStatusEnum, PostDonationDto } from '@donohub/shared';
import { SupabaseService } from '@/Supabase/supabase.service';

@Injectable()
export class DonationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createDonation(
    donation: PostDonationDto,
    clerkUserId: string,
    userInfoId: string,
    attachements: Array<Express.Multer.File>
  ) {
    const createdDonation = await this.prismaService.donation.create({
      include: {
        category: true,
        location: true,
      },
      data: {
        clerkUserId,
        description: donation.description,
        rating: 0,
        title: donation.title,
        phone: donation.phone,
        quantity: donation.quantity,
        categoryId: donation.categoryId,
        locationId: donation.locationId,
        userInfoId: userInfoId,
        status: DonationStatus.Enum.UNLISTED,
      },
    });
    const attachementsUrls = await this.supabaseService.uploadAndGetPubliUrl(
      `${clerkUserId}/${createdDonation.id}`,
      attachements,
    );
    return {
      ...createdDonation,
      status: createdDonation.status as unknown as DonationStatusEnum,
      category: createdDonation.category.name,
      attachements: attachementsUrls,
      location: {
        city: createdDonation.location.city,
        county: createdDonation.location.county,
        id: createdDonation.location.id,
        number: createdDonation.location.number,
        postalCode: createdDonation.location.postal_code,
        street: createdDonation.location.street,
        createdAt: createdDonation.location.createdAt,
        updatedAt: createdDonation.location.updatedAt,
      },
    };
  }

  async getDonationsByUser(clerkUserId: string, page: number, size: number) {

    return await this.prismaService.donation.findMany({
      take: size,
      skip: (page - 1) * size,
      include: {
        category: true,
        location: true,
        _count: true,
      },
      where: {
        clerkUserId,
      },
    });
  }

  async getDonationById(id: string) {
    return await this.prismaService.donation.findFirstOrThrow({
      where: { id },
      include: {
        category: true,
        location: true,
      },
    });
  }

  async listDonation(page: number, size: number) {
    return await this.prismaService.donation.findMany({
      where: {
        status: DonationStatus.Enum.LISTED,
      },
      take: size,
      skip: (page - 1) * size,
    });
  }
}
