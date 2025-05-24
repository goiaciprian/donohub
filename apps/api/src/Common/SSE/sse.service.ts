import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

type SseEventMessageType =
  | 'comment'
  | 'evaluation'
  | 'createRequest'
  | 'requestResolved';
interface BaseSseEventMessage<Type extends SseEventMessageType> {
  type: Type;
  message: string;
  title: string;
  clerkId: string;
  donationId?: string;
  requestId?: string;
}

type CommentSseEventMessage = BaseSseEventMessage<'comment' | 'evaluation'> & {
  donationId: string;
};

type RestSseEventMessage = BaseSseEventMessage<
  'createRequest' | 'requestResolved'
> & {
  requestId: string;
};

type SseEventMessage = CommentSseEventMessage | RestSseEventMessage;

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
