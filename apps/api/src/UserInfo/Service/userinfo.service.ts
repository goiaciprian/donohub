import { CLERK_CLIENT } from '@/Auth/clerk.provider';
import { UserUpdateEvent } from '@/Common/Dtos/userupdated.events';
import { PrismaService } from '@/Prisma/prisma.service';
import { type ClerkClient } from '@clerk/backend';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserInfoService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CLERK_CLIENT) private readonly clerkClient: ClerkClient,
  ) {}

  async getUserInfoById(id: string) {
    const userInfo = await this.prismaService.userInfo.findFirstOrThrow({
      where: {
        id,
      },
    });

    const clerkUser = await this.clerkClient.users.getUser(
      userInfo.clerkUserId,
    );

    return {
      fullName: clerkUser.fullName,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
      lastActiveAt: clerkUser.lastActiveAt,
      avatar: clerkUser.imageUrl,
      rating: userInfo.rating.toNumber(),
    };
  }

  async getUserInfoByClerkId(id: string) {
    const [clerkUser, userInfo] = await Promise.all([
      this.clerkClient.users.getUser(id),
      this.prismaService.userInfo.findFirstOrThrow({
        where: { clerkUserId: id },
      }),
    ]).catch((error) => {
      Logger.error(error);
      return [null, null];
    });

    return {
      fullName: clerkUser?.fullName ?? '',
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? null,
      lastActiveAt: clerkUser?.lastActiveAt,
      avatar: clerkUser?.imageUrl,
      rating: userInfo?.rating?.toNumber(),
    };
  }

  async completeRegister(clerkId: string) {
    await this.prismaService.userInfo.create({
      data: {
        clerkUserId: clerkId,
        rating: 0,
      },
    });
  }

  async completeDeletion(clerkId: string) {
    await this.prismaService.comment.deleteMany({
      where: {
        clerkUserId: clerkId,
      },
    });

    await this.prismaService.donation.deleteMany({
      where: { clerkUserId: clerkId },
    });

    await this.prismaService.userInfo.deleteMany({
      where: {
        clerkUserId: clerkId,
      },
    });
  }

  async updateUser(body: UserUpdateEvent) {
    await this.prismaService.$transaction(async (tx) => {
      await Promise.all([
        await tx.comment.updateMany({
          where: {
            clerkUserId: body.data.id
          },
          data: {
            full_name: `${body.data.first_name} ${body.data.last_name || ''}`,
            userImage: body.data.image_url,
          }
        }),
        await tx.donationEvaluation.updateMany({
          where: {
            clerkUserId: body.data.id
          },
          data: {
            userImage: body.data.image_url,
            userName: `${body.data.first_name} ${body.data.last_name || ''}`
          }
        }),
        await tx.donationRequest.updateMany({
          where: {
            clerkUserId: body.data.id
          },
          data: {
            userImage: body.data.image_url,
            userName: `${body.data.first_name} ${body.data.last_name || ''}`
          }
        })
      ])
    })
  }
}
