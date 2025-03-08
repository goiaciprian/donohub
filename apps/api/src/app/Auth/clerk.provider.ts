import { createClerkClient } from '@clerk/backend';
import { ConfigService } from "@nestjs/config";

export const CLERK_CLIENT = "ClerkClient";
export const ClerkClientProvider = {
    provide: CLERK_CLIENT,
    useFactory: (configService: ConfigService) => {
        return createClerkClient({
            publishableKey: configService.getOrThrow('clerkPublishableKey'),
            secretKey: configService.getOrThrow('clerkSecretKey'),
        })
    },
    inject: [ConfigService],
}