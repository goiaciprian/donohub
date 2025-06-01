import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

type SseEventMessage = unknown;

@Injectable()
export class SseService {
  private readonly sseObservable$ = new Subject<{ data: SseEventMessage }>();

  get observable$() {
    return this.sseObservable$.asObservable();
  }

  push$(data: SseEventMessage) {
    this.sseObservable$.next({ data });
  }
}
