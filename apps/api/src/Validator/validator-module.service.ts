import { Module } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: ValidatorService,
      inject: [ConfigService],
      useFactory: (configService) => new ValidatorService(configService),
    },
  ],
  exports: [ValidatorService],
})
export class ValidatorServiceModule {}
