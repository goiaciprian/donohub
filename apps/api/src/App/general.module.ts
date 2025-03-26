import { Module } from "@nestjs/common";
import { GeneralController } from "./general.controller";
import { CategoryServiceModule } from "@/Category/category-service.module";

@Module({
    imports: [CategoryServiceModule],
    controllers:[GeneralController],
})
export class GeneralModule {}