import { PrismaService } from '@/Prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  DonationDto,
  DonationEvaluationSchema,
  DonationEvaluationType,
  DonationStatus,
  DonationStatusEnum,
  PaginatedDonationDto,
  PaginatedDonationRequestByUserDto,
  PaginatedDonationUserRequestsDto,
  PaginatedEvaluatedDonationDto,
  PostDonationDto,
  PutDonationEvaluationDto,
  PutDonationRequestDto,
  UpdateDonationDto,
} from '@donohub/shared';
import { SupabaseService } from '@/Supabase/supabase.service';
import { ImageService } from '@/Image/Service/image.service';
import { PaginationQueryDto } from '@/Common/Dtos/pagination.dto';
import { UserType } from '@/Auth/clerk.strategy';
import { SseService } from '@/Common/SSE/sse.service';

@Injectable()
export class DonationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly imageService: ImageService,
    private readonly sseService: SseService,
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
      requestedUser: [],
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
        DonationRequest: {
          select: {
            clerkUserId: true,
          },
        },
      },
    });
    const linkAttachements = await Promise.all(
      donation.images.map(
        async (img) => await this.supabaseService.getPublicUrl(img.filename),
      ),
    );

    const { DonationRequest, ...rest } = donation;

    return {
      ...rest,
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
      requestedUser: DonationRequest.map((r) => r.clerkUserId),
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
    const donation = await this.prismaService.$transaction(async (tx) => {
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
      return await tx.donation.update({
        where: { id: donationId },
        data: {
          status: isAccepted
            ? DonationStatus.Enum.LISTED
            : DonationStatus.Enum.NEEDS_WORK,
        },
      });
    });

    this.sseService.push$({
      clerkId: donation.categoryId,
      message: `Your donation: ${donation.title} was reviewed with status: ${status}`,
      title: 'Donation evaluated',
    });

    return donation;
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

  async createDonationRequest(
    donationId: string,
    body: PutDonationRequestDto,
    user: UserType,
  ) {
    const donation = await this.prismaService.donation.findFirstOrThrow({
      where: { id: donationId },
    });

    await this.prismaService.donationRequest.create({
      data: {
        clerkUserId: user.id,
        userImage: user.imageUrl,
        userName: `${user.firstName} ${user.lastName}`,
        comment: body.comment,
        donationId,
      },
    });

    this.sseService.push$({
      clerkId: donation.clerkUserId,
      message: `User ${user.firstName} ${user.lastName} made a request for ${donation.title}`,
      title: `Donation request`,
    });
  }

  async resolveDonationRequest(
    requestId: string,
    status: DonationEvaluationType,
    user: UserType,
  ) {
    const [dr, delcinedUsers] = await this.prismaService.$transaction(
      async (tx) => {
        const dr = await tx.donationRequest.update({
          where: {
            id: requestId,
            donation: {
              clerkUserId: user.id,
            },
          },
          data: {
            status,
          },
          select: {
            donation: {
              select: {
                title: true,
                id: true,
              },
            },
            clerkUserId: true,
            id: true,
          },
        });

        let delcinedUsers: Prisma.DonationRequestGetPayload<{
          select: {
            donation: {
              select: {
                title: true;
              };
            };
            clerkUserId: true;
          };
        }>[] = [];

        if (status === 'ACCEPTED') {
          delcinedUsers = await tx.donationRequest.updateManyAndReturn({
            where: {
              donation: {
                clerkUserId: user.id,
                id: dr.donation.id,
              },
              id: {
                notIn: [dr.id],
              },
            },
            data: {
              status: DonationEvaluationSchema.Enum.DECLINED,
            },
            select: {
              donation: {
                select: {
                  title: true,
                },
              },
              clerkUserId: true,
            },
          });
        }

        return [dr, delcinedUsers];
      },
    );

    this.sseService.push$({
      clerkId: dr.clerkUserId,
      message: `Your request for ${dr.donation.title} has been ${status}`,
      title: 'Donation request',
    });

    delcinedUsers.map((du) =>
      this.sseService.push$({
        clerkId: du.clerkUserId,
        message: `Your request for ${du.donation.title} has been DECLINED`,
        title: 'Donation request',
      }),
    );
  }

  async getSelfDonationRequests(
    pagination: PaginationQueryDto,
    user: UserType,
  ): Promise<PaginatedDonationRequestByUserDto> {
    const { page, size } = pagination;

    const skip = (page - 1) * size;

    const [count, items] = await this.prismaService.$transaction(async (tx) => {
      return await Promise.all([
        tx.donationRequest.count({ where: { clerkUserId: user.id } }),
        tx.donationRequest.findMany({
          take: size,
          skip,
          where: { clerkUserId: user.id },
          select: {
            id: true,
            createdAt: true,
            comment: true,
            status: true,
            donation: { select: { id: true, title: true, clerkUserId: true } },
          },
        }),
      ]);
    });

    const totalPages = Math.ceil(count / size);
    return {
      hasNext: page < totalPages,
      hasPrev: page > 1,
      size,
      page,
      totalItems: count,
      totalPages,
      items: items.map((dr) => ({
        comment: dr.comment,
        createdAt: dr.createdAt,
        donationId: dr.donation.id,
        donationTitle: dr.donation.title,
        donationUserId: dr.donation.clerkUserId,
        id: dr.id,
        status: dr.status as DonationEvaluationType,
      })),
    };
  }

  async getDonationRequests(
    pagination: PaginationQueryDto,
    user: UserType,
  ): Promise<PaginatedDonationUserRequestsDto> {
    const { page, size } = pagination;

    const skip = (page - 1) * size;

    const [count, items] = await this.prismaService.$transaction(async (tx) => {
      return await Promise.all([
        tx.donationRequest.count({
          where: { donation: { clerkUserId: user.id } },
        }),
        tx.donation.findMany({
          take: size,
          skip,
          where: {
            clerkUserId: user.id,
            DonationRequest: {
              some: {},
            },
          },
          select: {
            id: true,
            title: true,
            DonationRequest: {
              select: {
                id: true,
                clerkUserId: true,
                userImage: true,
                userName: true,
                comment: true,
                status: true,
                createdAt: true,
              },
            },
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
      totalPages,
      totalItems: count,
      items: items.map((dr) => {
        const { DonationRequest, ...rest } = dr;
        return {
          ...rest,
          requests: DonationRequest.map((r) => ({
            id: r.id,
            createdAt: r.createdAt,
            status: r.status as DonationEvaluationType,
            comment: r.comment,
            clerkUserId: r.clerkUserId,
            userName: r.userName,
            userImage: r.userImage,
          })),
        };
      }),
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
