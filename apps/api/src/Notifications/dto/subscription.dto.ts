import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

const SubscriptionSchema = extendApi(
  z.object({
    endpoint: z.string(),
    keys: z.object({
      auth: z.string(),
      p256dh: z.string(),
    }),
  }),
);

export class SubscriptionDto extends createZodDto(SubscriptionSchema) {}
