import { PrismaService } from '@/Prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  DonationDto,
  DonationEvaluationType,
  DonationStatus,
  DonationStatusEnum,
  PaginatedDonationDto,
  PaginatedEvaluatedDonationDto,
  PostDonationDto,
  PutDonationEvaluationDto,
  UpdateDonationDto,
} from '@donohub/shared';
import { SupabaseService } from '@/Supabase/supabase.service';
import { ImageService } from '@/Image/Service/image.service';
import { PaginationQueryDto } from '@/Common/Dtos/pagination.dto';
import { UserType } from '@/Auth/clerk.strategy';

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
  ): Promise<PaginatedEvaluatedDonationDto> {
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
            DonationEvaluation: true,
            images: {
              select: {
                filename: true,
              },
            },
          },
          where: {
            clerkUserId,
          },
          orderBy: {
            updatedAt: 'desc',
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

    return {
      hasNext: page < totalPages,
      hasPrev: page > 1,
      page,
      size,
      totalItems: count,
      totalPages,
      items: await Promise.all(
        items.map(async (donationComplete) => {
          const donationDto = await this.map(donationComplete);
          return {
            ...donationDto,
            categoryId: donationComplete.categoryId,
            locationId: donationComplete.locationId,
            evaluations: await Promise.all(
              donationComplete.DonationEvaluation.map((ev) => ({
                id: ev.id,
                clerkUserId: ev.clerkUserId,
                approved: ev.approved,
                userImage: ev.userImage,
                userName: ev.userName,
                comment: ev.comment,
                createdAt: ev.createdAt,
              })),
            ),
          };
        }),
      ),
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
            OR: q.split(' ').flatMap((word) => [
              {
                title: { contains: word, mode: 'insensitive' },
              },
              {
                description: { contains: word, mode: 'insensitive' },
              },
            ]),
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

    const donationDto = await Promise.all(items.map((e) => this.map(e)));

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

  async updateDonation(
    donationId: string,
    partialDonation: UpdateDonationDto,
    attachements: Express.Multer.File[] | undefined,
    user: UserType,
  ) {
    const donationEntity = await this.prismaService.donation.findFirstOrThrow({
      where: {
        id: donationId,
        clerkUserId: user.id,
      },
      include: {
        images: true,
      },
    });

    const newAttachements: Express.Multer.File[] = [];
    if (attachements) {
      const existingLength = donationEntity.images.length;
      newAttachements.concat(attachements.slice(0, 4 - existingLength));
    }

    await this.prismaService.donation.update({
      where: {
        id: donationId,
        status: DonationStatus.Enum.NEEDS_WORK,
      },
      data: {
        ...partialDonation,
        status: DonationStatus.Enum.USER_UPDATED,
        images: {
          connect: (
            await this.imageService.uploadImages(newAttachements, user.id)
          ).map((fh) => ({
            filename_hash: { filename: fh.filename, hash: fh.hash },
          })),
        },
      },
    });

    return this.getDonationById(donationEntity.id);
  }

  async evaluateDonation(
    donationId: string,
    status: DonationEvaluationType,
    evaluationDto: PutDonationEvaluationDto,
    user: UserType,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const isAccepted = status === 'ACCEPTED';
      await tx.donationEvaluation.create({
        data: {
          approved: isAccepted,
          clerkUserId: user.id,
          userImage: user.imageUrl,
          userName: `${user.firstName} ${user.lastName}`,
          comment: evaluationDto.comment,
          donation: {
            connect: {
              id: donationId,
            },
          },
        },
      });
      await tx.donation.update({
        where: { id: donationId },
        data: {
          status: isAccepted
            ? DonationStatus.Enum.LISTED
            : DonationStatus.Enum.NEEDS_WORK,
        },
      });
    });
  }

  async getUnlistedDonations(
    { page, size }: PaginationQueryDto,
    user: UserType,
  ): Promise<PaginatedDonationDto> {
    const take = size;
    const skip = (page - 1) * take;

    const [total, itemsEntity] = await this.prismaService.$transaction(
      async (tx) => {
        return await Promise.all([
          tx.donation.count({
            where: {
              status: {
                in: [
                  DonationStatus.Enum.UNLISTED,
                  DonationStatus.Enum.USER_UPDATED,
                ],
              },
              clerkUserId: { notIn: [user.id] },
            },
          }),
          tx.donation.findMany({
            take,
            skip,
            where: {
              status: {
                in: [
                  DonationStatus.Enum.UNLISTED,
                  DonationStatus.Enum.USER_UPDATED,
                ],
              },
              clerkUserId: { notIn: [user.id] },
            },
            orderBy: { createdAt: 'asc' },
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
        ]);
      },
    );

    const totalPages = Math.ceil(total / size);
    return {
      hasNext: page < totalPages,
      hasPrev: page > 1,
      page,
      size,
      totalItems: total,
      totalPages,
      items: await Promise.all(itemsEntity.map((e) => this.map(e))),
    };
  }

  async getEvaluatedDonationsByUser(
    clerkId: string,
    { page, size }: PaginationQueryDto,
  ): Promise<PaginatedEvaluatedDonationDto> {
    const take = size;
    const skip = (page - 1) * take;

    const whereObj: Prisma.DonationWhereInput = {
      DonationEvaluation: {
        some: {
          clerkUserId: clerkId,
        },
      },
    };

    const [total, items] = await this.prismaService.$transaction(async (tx) => {
      return await Promise.all([
        tx.donation.count({
          where: {
            ...whereObj,
          },
        }),
        tx.donation.findMany({
          where: {
            ...whereObj,
          },
          take,
          skip,
          include: {
            category: true,
            location: true,
            DonationEvaluation: true,
            images: {
              select: {
                filename: true,
              },
            },
          },
        }),
      ]);
    });

    const totalPages = Math.ceil(total / size);
    return {
      hasNext: page < totalPages,
      hasPrev: page > 1,
      page,
      size,
      totalItems: total,
      totalPages,
      items: await Promise.all(
        items.map(async (donationComplete) => {
          const donationDto = await this.map(donationComplete);
          return {
            ...donationDto,
            categoryId: donationComplete.categoryId,
            locationId: donationComplete.locationId,
            evaluations: await Promise.all(
              donationComplete.DonationEvaluation.map((ev) => ({
                id: ev.id,
                clerkUserId: ev.clerkUserId,
                approved: ev.approved,
                userImage: ev.userImage,
                userName: ev.userName,
                comment: ev.comment,
                createdAt: ev.createdAt,
              })),
            ),
          };
        }),
      ),
    };
  }

  private async map(
    donationEntity: Prisma.DonationGetPayload<{
      include: {
        category: true;
        location: true;
        images: {
          select: {
            filename: true;
          };
        };
      };
    }>,
  ) {
    const { images, status, category, location, ...rest } = donationEntity;
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
      attachements: images.map((img) =>
        this.supabaseService.getPublicUrl(img.filename),
      ),
    };
  }
}
