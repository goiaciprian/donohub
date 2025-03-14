import { BadRequestException, Body, Controller, Inject, NotFoundException, Post } from "@nestjs/common";
import { type ClerkClient } from "@clerk/backend";
import { CLERK_CLIENT } from "@/Auth/clerk.provider";
import { LoginBodyDto } from "@donohub/shared";
import { IsPublic } from '@/Common/Decorators/public.decorator';

/**
 * TODO see to generate a token
 */
@Controller()
@IsPublic()
export class AuthController {

    constructor(@Inject(CLERK_CLIENT) private readonly clerkClient: ClerkClient) {}

    @Post('auth/login')
    async login(@Body() body: LoginBodyDto) {
        const users = await this.clerkClient.users.getUserList({
            emailAddress: [body.email],
        });

        if (users.totalCount === 0) {
            throw new NotFoundException();
        }

        const correctUser = users.data[0];
        const { verified } = await this.clerkClient.users.verifyPassword({
            password: body.password,
            userId: correctUser.id
        });

        if (!verified) {
            throw new BadRequestException();
        }

        return await this.clerkClient.signInTokens.createSignInToken({
            userId: correctUser.id,
            expiresInSeconds: 3600,
        });

        // return this.clerkClient.sessions.getToken(Date.now().toString(), 'test')        
    }
}