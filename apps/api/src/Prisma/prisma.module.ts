import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@/Prisma/prisma.service';
// import { ConfigService } from '@/Common/Config/config.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new PrismaService({
          datasourceUrl: configService.getOrThrow('databaseUrl'),
          transactionOptions: { timeout: 10000 },
        }),
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
