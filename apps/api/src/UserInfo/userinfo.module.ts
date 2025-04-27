import { Module } from "@nestjs/common";
import { UserInfoController } from "./userinfo.controller";
import { UserInfoServiceModule } from "./Service/userinfo-service.module";

@Module({
  imports: [UserInfoServiceModule],
  controllers: [UserInfoController],
})
export class UserInfoModule {}