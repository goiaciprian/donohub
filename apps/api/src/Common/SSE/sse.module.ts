import { Global, Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { ValidatorServiceModule } from '@/Validator/validator-module.service';

@Global()
@Module({
  imports: [ValidatorServiceModule],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
