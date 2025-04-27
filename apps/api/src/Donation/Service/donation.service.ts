import { PrismaService } from '@/Prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  DonationDto,
  DonationStatus,
  DonationStatusEnum,
  PaginatedDonationDto,
  PostDonationDto,
} from '@donohub/shared';
import { SupabaseService } from '@/Supabase/supabase.service';
import { ImageService } from '@/Image/Service/image.service';

@Injectable()
export class DonationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly imageService: ImageService,
  ) {}

  async createDonation(
    donation: PostDonationDto,
    clerkUserId: string,
    userInfoId: string,
    attachements: Array<Express.Multer.File>,
  ): Promise<DonationDto> {
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
        images: {
          connect: (
            await this.imageService.uploadImages(attachements, clerkUserId)
          ).map((fh) => ({
            filename_hash: { filename: fh.filename, hash: fh.hash },
          })),
        },
      },
    });
    const attachementsUrls =
      await this.supabaseService.uploadAndGetPubliUrl(attachements);
    return {
      ...createdDonation,
      status: createdDonation.status as unknown as DonationStatusEnum,
      category: createdDonation.category.name,
      attachements: attachementsUrls,
      location: {
        city: createdDonation.location.city,
        county: createdDonation.location.county,
        number: createdDonation.location.number,
        postalCode: createdDonation.location.postal_code,
        street: createdDonation.location.street,
      },
    };
  }

  async getDonationsByUser(
    clerkUserId: string,
    page: number,
    size: number,
  ): Promise<PaginatedDonationDto> {
    const take = size;
    const skip = (page - 1) * size;

    const [items, count] = await this.prismaService.$transaction(async (tx) => {
      return await Promise.all([
        tx.donation.findMany({
          take,
          skip,
          include: {
            category: true,
            location: true,
            images: {
              select: {
                filename: true,
              },
            },
          },
          where: {
            clerkUserId,
          },
        }),
        tx.donation.count({
          where: {
            clerkUserId,
          },
        }),
      ]);
    });

    const totalPages = Math.ceil(count / size);
    const donationDto = await Promise.all(
      items.map(async (donation) => {
        const { images, status, category, location, ...rest } = donation;
        return {
          ...rest,
          location: {
            city: location.city,
            county: location.county,
            number: location.number,
            postalCode: location.postal_code,
            street: location.street,
          },
          category: category.name,
          status: status as DonationStatusEnum,
          attachements: await Promise.all(
            images.map((img) =>
              this.supabaseService.getPublicUrl(img.filename),
            ),
          ),
        };
      }),
    );

    return {
      hasNext: page < totalPages,
      hasPrev: page > 1,
      page,
      size,
      totalItems: count,
      totalPages,
      items: donationDto,
    };
  }

  async getDonationById(id: string): Promise<DonationDto> {
    const donation = await this.prismaService.donation.findFirstOrThrow({
      where: { id },
      include: {
        category: true,
        location: true,
        images: {
          select: {
            filename: true,
          },
        },
      },
    });
    const linkAttachements = await Promise.all(
      donation.images.map(
        async (img) => await this.supabaseService.getPublicUrl(img.filename),
      ),
    );
    return {
      ...donation,
      attachements: linkAttachements,
      clerkUserId: donation.clerkUserId,
      category: donation.category.name,
      status: donation.status as DonationStatusEnum,
      location: {
        city: donation.location.city,
        county: donation.location.county,
        number: donation.location.number,
        postalCode: donation.location.postal_code,
        street: donation.location.street,
      },
    };
  }

  async listDonation(
    page: number,
    size: number,
    category?: string,
    location?: string,
    q?: string,
  ): Promise<PaginatedDonationDto> {
    const take = size;
    const skip = (page - 1) * size;
    // county, city, street
    const locationParts =
      location?.split(',').map((part) => part || undefined) ?? [];

    const where: Prisma.DonationWhereInput = {
      status: DonationStatus.Enum.LISTED,
      categoryId: category,
      ...(locationParts.length !== 0
        ? {
            location: {
              county: locationParts[0],
              city: locationParts[1],
              street: locationParts[2],
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              {
                title: { contains: q, mode: 'insensitive' },
              },
              {
                description: { contains: q, mode: 'insensitive' },
              },
            ],
          }
        : {}),
    };

    const [items, count] = await this.prismaService.$transaction(async (tx) => {
      return await Promise.all([
        tx.donation.findMany({
          where,
          take,
          skip,
          include: {
            category: true,
            location: true,
            images: {
              select: {
                filename: true,
              },
            },
          },
        }),
        tx.donation.count({
          where,
        }),
      ]);
    });
    const totalPages = Math.ceil(count / size);

    const donationDto = await Promise.all(
      items.map(async (donation) => {
        const { images, status, category, location, ...rest } = donation;
        return {
          ...rest,
          location: {
            city: location.city,
            county: location.county,
            number: location.number,
            postalCode: location.postal_code,
            street: location.street,
          },
          category: category.name,
          status: status as DonationStatusEnum,
          attachements: await Promise.all(
            images.map((img) =>
              this.supabaseService.getPublicUrl(img.filename),
            ),
          ),
        };
      }),
    );

    return {
      hasNext: page < totalPages,
      hasPrev: page > 1,
      page,
      size,
      totalItems: count,
      totalPages,
      items: donationDto,
    };
  }
}
