import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type PrismaServiceOptions = ConstructorParameters<typeof PrismaClient>[0];

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(options?: PrismaServiceOptions) {
    super(options);
  }

  async onModuleInit() {
    this.$connect();
  }


}
