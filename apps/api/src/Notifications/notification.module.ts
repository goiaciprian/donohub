import { Global, Module } from '@nestjs/common';
import { WebPushModule } from './webpush.module';
import { NotificationServie } from './service/notification.service';

@Global()
@Module({
  imports: [WebPushModule],
  providers: [NotificationServie],
  exports: [NotificationServie],
})
export class NotificationModule {}
