import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private readonly sseObservable$ = new Subject<{
    data: { message: string; clerkId: string; title: string };
  }>();

  get observable$() {
    return this.sseObservable$.asObservable();
  }

  push$(data: { message: string; clerkId: string; title: string }) {
    this.sseObservable$.next({ data });
  }
}
