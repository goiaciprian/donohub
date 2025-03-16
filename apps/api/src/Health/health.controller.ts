import { IsPublic } from '@/Common/Decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
@IsPublic()
export class HealthController {
  constructor(private readonly healthChechService: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthChechService.check([]);
  }
}
