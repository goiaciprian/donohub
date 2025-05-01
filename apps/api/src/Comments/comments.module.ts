import { Module } from "@nestjs/common";
import { CommentsServiceModule } from "./Service/coments-service.module";
import { CommentsController } from "./comments.controller";

@Module({
  imports: [CommentsServiceModule],
  controllers: [CommentsController]
})
export class CommentsModule {}