import { Module } from "@nestjs/common";
import { DonationService } from "./donation.service";
import { ImageServiceModule } from "@/Image/Service/image-service.module";

@Module({
    imports: [ImageServiceModule],
    providers: [DonationService],
    exports: [DonationService],
})
export class DonationServiceModule{}