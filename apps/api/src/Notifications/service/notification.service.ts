import { Inject, Injectable, Logger } from '@nestjs/common';
import { SubscriptionDto } from '../dto/subscription.dto';
import { PrismaService } from '@/Prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { type WebPush, WEBPUSH } from '../webpush.module';
import { WebPushError } from 'web-push';
import { EventType } from '@/Common/Event/event.service';

type WebEventMessageType =
  | 'comment'
  | 'evaluation'
  | 'createRequest'
  | 'requestResolved';
interface BaseWebEventMessage<Type extends WebEventMessageType> {
  type: Type;
  message: string;
  title: string;
  clerkId: string;
  donationId?: string;
  requestId?: string;
}

type CommentWebEventMessage = BaseWebEventMessage<
  'comment' | 'evaluation' | 'createRequest'
> & {
  donationId: string;
};

type RestWebEventMessage = BaseWebEventMessage<'requestResolved'> & {
  requestId: string;
};

export type WebEventMessage = CommentWebEventMessage | RestWebEventMessage;

@Injectable()
export class NotificationServie {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(WEBPUSH) private readonly webpush: WebPush,
  ) {}

  async subscribe(userId: string, sub: SubscriptionDto) {
    await this.prismaService.subscription.create({
      data: {
        clerkUserId: userId,
        authKey: sub.keys.auth,
        endpoint: sub.endpoint,
        p256dhkey: sub.keys.p256dh,
      },
    });
  }

  async unsubscribe(userId: string) {
    await this.prismaService.subscription.deleteMany({
      where: { clerkUserId: userId },
    });
  }

  @OnEvent(EventType.WebPush)
  async handle(event: WebEventMessage) {
    const subscriptions = await this.prismaService.subscription.findMany({
      where: { clerkUserId: event.clerkId },
    });

    for (const s of subscriptions) {
      const payload = JSON.stringify(event);

      if (!s.authKey || !s.p256dhkey || !s.endpoint) {
        await this.prismaService.subscription.delete({ where: { id: s.id } });
        continue;
      }

      this.webpush
        .sendNotification(
          {
            endpoint: s.endpoint,
            keys: { auth: s.authKey, p256dh: s.p256dhkey },
          },
          payload,
        )
        .catch((err: WebPushError) => {
          Logger.error(err);
          this.prismaService.subscription.delete({
            where: { endpoint: err.endpoint },
          });
        });
    }
  }
}
