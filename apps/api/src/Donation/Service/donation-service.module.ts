import { Module } from "@nestjs/common";
import { DonationService } from "./donation.service";
import { ImageServiceModule } from "@/Image/Service/image-service.module";
import { ValidatorServiceModule } from "@/Validator/validator-module.service";

@Module({
    imports: [ImageServiceModule, ValidatorServiceModule],
    providers: [DonationService],
    exports: [DonationService],
})
export class DonationServiceModule{}