import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SseService } from '../SSE/sse.service';

@Injectable()
export class CoreListeners {
  constructor(private readonly sseService: SseService) {}

  @OnEvent('test.post')
  async handleTest(message: string) {
    this.sseService.push$({
      message,
    });
    console.log(`event emitter: ${message}`);
  }

  @OnEvent('user.rating')
  async calculateUserRating(_userId: string) {
    //not empty
  }
}
