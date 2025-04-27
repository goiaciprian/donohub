import { Global, Module } from "@nestjs/common";
import { CLERK_CLIENT, ClerkClientProvider } from "@/Auth/clerk.provider";
import { PassportModule } from "@nestjs/passport";
import { ClerkStrategy } from "@/Auth/clerk.strategy";

@Global()
@Module({
    imports: [PassportModule],
    providers: [ClerkClientProvider, ClerkStrategy],
    exports: [CLERK_CLIENT, PassportModule],
})
export class AuthModule {}