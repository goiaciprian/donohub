import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import z from 'zod';

export const DataSchema = extendApi(
  z.object({
    deleted: z.boolean(),
    id: z.string(),
    object: z.string(),
  }),
);

export const HttpRequestSchema = extendApi(
  z.object({
    client_ip: z.string(),
    user_agent: z.string(),
  }),
);

export const EventAttributesSchema = extendApi(
  z.object({
    http_request: HttpRequestSchema,
  }),
);

export const UserDeletedEventSchema = extendApi(
  z.object({
    data: DataSchema,
    event_attributes: EventAttributesSchema,
    object: z.string(),
    timestamp: z.number(),
    type: z.string(),
  }),
);

export class UserDeletedEvent extends createZodDto(UserDeletedEventSchema) {}
