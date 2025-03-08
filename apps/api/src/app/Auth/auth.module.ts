import { Module } from "@nestjs/common";
import { CLERK_CLIENT, ClerkClientProvider } from "./clerk.provider";
import { PassportModule } from "@nestjs/passport";
import { ClerkStrategy } from "./clerk.strategy";

@Module({
    imports: [PassportModule],
    providers: [ClerkClientProvider, ClerkStrategy],
    exports: [CLERK_CLIENT, PassportModule],
})
export class AuthModule {}