import { WebEventMessage } from '@/Notifications/service/notification.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const EventType = { WebPush: 'webpush' } as const;

@Injectable()
export class EventService {
  constructor(private eventEmitter: EventEmitter2) {}

  sendNotification(payload: WebEventMessage) {
    this.eventEmitter.emit(EventType.WebPush, payload);
  }
}
