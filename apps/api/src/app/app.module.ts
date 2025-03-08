import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { loggerFactory } from './Core/Logger';
import { LoggerMiddleware } from './Core/Middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { load } from './Common/Config';
import { AuthModule } from './Auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ClerkAuthGuard } from './Common/Guards/auth.guard';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: loggerFactory,
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: '.env',
      load: [load]
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*splat')
  }
}
