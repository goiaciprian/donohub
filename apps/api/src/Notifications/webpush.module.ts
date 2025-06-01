import { Configuration } from '@/Common/Config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import webpush from 'web-push';

export declare type WebPush = typeof webpush;

export const WEBPUSH = 'webpush';

@Module({
  providers: [
    {
      provide: WEBPUSH,
      useFactory: (configService: ConfigService<Configuration>) => {
        const vapid = configService.getOrThrow<Configuration['vapid']>('vapid');

        webpush.setVapidDetails(
          vapid.sender,
          vapid.publicKey,
          vapid.privateKey,
        );

        return webpush;
      },
      inject: [ConfigService],
    },
  ],
  exports: [WEBPUSH],
})
export class WebPushModule {}
