import { Module } from "@nestjs/common";
import { DonationService } from "./donation.service";

@Module({
    providers: [DonationService],
    exports: [DonationService],
})
export class DonationServiceModule{}