import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerFactory } from '@/Core/Logger';
import { LoggerMiddleware } from '../Core/Middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationSchema, load } from '@/Common/Config';
import { AuthModule } from '@/Auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ClerkAuthGuard } from '@/Common/Guards/auth.guard';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { HealthModule } from '@/Health/health.module';
import { PrismaModule } from '@/Prisma/prisma.module';
import { SupabaseModule } from '@/Supabase/supanase.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ListenersModule } from '@/Common/Listenters/listener.module';
import { SseModule } from '@/Common/SSE/sse.module';
import { GeneralModule } from './general.module';
import { DonationModule } from '@/Donation/donation.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LocationModule } from '@/Location/location.module';

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
    EventEmitterModule.forRoot(),
    ListenersModule,
    SseModule,
    MulterModule.register({
      storage: memoryStorage
    }),

    GeneralModule,
    DonationModule,
    LocationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
