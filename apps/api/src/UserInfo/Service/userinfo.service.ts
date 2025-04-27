import { CLERK_CLIENT } from '@/Auth/clerk.provider';
import { PrismaService } from '@/Prisma/prisma.service';
import { type ClerkClient } from '@clerk/backend';
import { Inject, Injectable } from '@nestjs/common';

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
    ]);

    return {
      fullName: clerkUser.fullName,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
      lastActiveAt: clerkUser.lastActiveAt,
      avatar: clerkUser.imageUrl,
      rating: userInfo.rating.toNumber(),
    };
  }
}
