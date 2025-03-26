import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

export const LocationSchema = extendApi(
  z.object({
    id: z.string(),
    street: z.string().nullable(),
    number: z.string().nullable(),
    city: z.string(),
    county: z.string(),
    postalCode: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);

export class LocationDto extends createZodDto(LocationSchema) {}
export class PostLocationDto extends createZodDto(
  LocationSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
) {}
