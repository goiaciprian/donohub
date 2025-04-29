import { User, verifyToken, type ClerkClient } from '@clerk/backend';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { CLERK_CLIENT } from '@/Auth/clerk.provider';
import { ConfigService } from '@nestjs/config';
import express from 'express';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/Prisma/prisma.service';

export type UserType = User & {
  userInfo: Prisma.UserInfoGetPayload<{
    select: {
      clerkUserId: true;
      createdAt: true;
      id: true;
      rating: true;
      updatedAt: true;
    };
  }>;
};
@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(
    @Inject(CLERK_CLIENT)
    private readonly clerkClient: ClerkClient,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async validate(req: express.Request): Promise<UserType> {
    const isAuthDisabled = this.configService.get<boolean>('authDisabled');
    if (isAuthDisabled) {
      Logger.warn('Auth is disabled this should be done only in development');
      const user = {
        id: 'user_2u29ppkZlAPMSACYPpsLEFGox5k',
        firstName: 'dev',
        lastName: 'name',
        fullName: 'dev name',
        userInfo: {
          id: '6f2ecf31-3226-4c4b-a642-e82292d5db72',
          clerkUserId: 'user_2u29ppkZlAPMSACYPpsLEFGox5k',
          raging: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      } as unknown as UserType;
      return user;
    }

    const token = req.headers.authorization?.split(' ').pop();

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get('clerkSecretKey'),
        authorizedParties: [
          'https://donohub.srv-lab.work',
          'https://donohub.srv-lab.work',
        ],
      });

      const user = await this.clerkClient.users.getUser(tokenPayload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      // try {
      const userInfo = await this.prismaService.userInfo.findFirstOrThrow({
        where: { clerkUserId: user.id },
      });
      return {
        ...user,
        userInfo,
      } as UserType;
      // } catch (_e) {
      //   const userInfo = await this.prismaService.userInfo.create({
      //     data: {
      //       clerkUserId: user.id,
      //       rating: 0,
      //     },
      //   });
      //   return {
      //     ...user,
      //     userInfo,
      //   } as UserType;
      // }
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException();
    }
  }
}
