import { WebEventMessage } from '@/Notifications/service/notification.service';
import { ValidationInput } from '@/Validator/validator.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const EventType = { WebPush: 'webpush', Validation: 'validation' } as const;

@Injectable()
export class EventService {
  constructor(private eventEmitter: EventEmitter2) {}

  sendNotification(payload: WebEventMessage) {
    this.eventEmitter.emit(EventType.WebPush, payload);
  }

  sendToValidation(payload: ValidationInput) {
    this.eventEmitter.emit(EventType.Validation, payload);
  }
}
