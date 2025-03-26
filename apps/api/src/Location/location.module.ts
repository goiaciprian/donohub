import { Module } from "@nestjs/common";
import { LocationServiceModule } from "./Service/location-service.module";
import { LocationController } from "./location.controller";

@Module({
    imports: [LocationServiceModule],
    controllers: [LocationController]
})
export class LocationModule {}