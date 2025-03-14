import { Module } from "@nestjs/common";
import { CLERK_CLIENT, ClerkClientProvider } from "@/Auth/clerk.provider";
import { PassportModule } from "@nestjs/passport";
import { ClerkStrategy } from "@/Auth/clerk.strategy";
// import { AuthController } from "./auth.controller";

@Module({
    imports: [PassportModule],
    providers: [ClerkClientProvider, ClerkStrategy],
    // controllers: [AuthController],
    exports: [CLERK_CLIENT, PassportModule],
})
export class AuthModule {}