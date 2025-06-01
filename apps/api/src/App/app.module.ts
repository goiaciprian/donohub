import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerFactory } from '@/Core/Logger';
import { LoggerMiddleware } from '../Core/Middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationSchema, load } from '@/Common/Config';
import { AuthModule } from '@/Auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { HealthModule } from '@/Health/health.module';
import { PrismaModule } from '@/Prisma/prisma.module';
import { SupabaseModule } from '@/Supabase/supanase.module';
import { SseModule } from '@/Common/SSE/sse.module';
import { GeneralModule } from './general.module';
import { DonationModule } from '@/Donation/donation.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LocationModule } from '@/Location/location.module';
import { UserInfoModule } from '@/UserInfo/userinfo.module';
import { CommentsModule } from '@/Comments/comments.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ApiKeyGuard } from '@/Common/Guards/api-key.guard';
import { EventModule } from '@/Common/Event/event.module';
import { NotificationModule } from '@/Notifications/notification.module';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: loggerFactory,
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
      load: [load],
      validate: (config: Record<string, unknown>) => {
        return ConfigurationSchema.safeParse(config);
      },
    }),
    AuthModule,
    HealthModule,
    PrismaModule,
    SupabaseModule,
    SseModule,
    MulterModule.register({
      storage: memoryStorage,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 100,
          ttl: 30,
        },
      ],
    }),

    EventModule,
    NotificationModule,
    GeneralModule,
    DonationModule,
    LocationModule,
    UserInfoModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
