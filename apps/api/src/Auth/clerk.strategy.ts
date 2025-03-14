import { verifyToken, type ClerkClient, type User } from '@clerk/backend';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { CLERK_CLIENT } from '@/Auth/clerk.provider';
import { ConfigService } from '@nestjs/config';
import express from 'express';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(
    @Inject(CLERK_CLIENT)
    private readonly clerkClient: ClerkClient,
    private readonly configService: ConfigService
  ) {
    super();
  }

  async validate(req: express.Request): Promise<User> {
    const token = req.headers.authorization?.split(' ').pop();

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get('clerkSecretKey'),
      });

      const user = await this.clerkClient.users.getUser(tokenPayload.sub);

      return user;
    } catch (error) {
      Logger.error(error)
      throw new UnauthorizedException('Invalid token');
    }
  }
}
