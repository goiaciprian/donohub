import { Module } from "@nestjs/common";
import { DonationServiceModule } from "./Service/donation-service.module";
import { DonationController } from "./donation.controller";

@Module({
    imports: [DonationServiceModule],
    controllers: [DonationController],
})
export class DonationModule {}