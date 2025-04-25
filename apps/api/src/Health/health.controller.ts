import { IsPublic } from '@/Common/Decorators/public.decorator';
import { PrismaService } from '@/Prisma/prisma.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
@ApiTags('general')
@IsPublic()
export class HealthController {
  constructor(
    private readonly healthChechService: HealthCheckService,
    private readonly prismaHealthCheck: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthChechService.check([
      () => this.prismaHealthCheck.pingCheck('supabase_db', this.prismaService),
    ]);
  }
}
