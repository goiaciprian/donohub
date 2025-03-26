import { PrismaService } from '@/Prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserInfoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserInfoById(id: string) {
    return this.prismaService.userInfo.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async getUserInfoByClerkId(id: string) {
    return await this.prismaService.userInfo.findFirstOrThrow({
      where: {
        clerkUserId: id,
      },
    });
  }
}
