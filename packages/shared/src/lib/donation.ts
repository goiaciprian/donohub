import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import z from 'zod';
import { LocationSchema } from './location';
import { createPaginatedResponse } from './utils/utils';

export const DonationStatus = extendApi(
  z.enum(['UNLISTED', 'LISTED', 'IN_PROGRESS', 'RESOLVED']),
);

export type DonationStatusEnum = z.infer<typeof DonationStatus>;

export const DonationSchema = extendApi(
  z.object({
    id: z.string(),
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    quantity: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    rating: z.number(),
    status: DonationStatus,
  }),
);

export const PostDonationSchema = extendApi(
  DonationSchema.extend({
    locationId: z.string().nonempty(),
    categoryId: z.string().nonempty(),
  }).omit({
    createdAt: true,
    updatedAt: true,
    rating: true,
    id: true,
    status: true,
  }),
  {
    properties: {
      attachements: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
        minItems: 1,
        maxItems: 4,
      },
    },
    required: ['attachements'],
  },
);

export class PostDonationDto extends createZodDto(PostDonationSchema) {}
export class DonationDto extends createZodDto(
  DonationSchema.extend({
    category: z.string(),
    clerkUserId: z.string(),
    location: LocationSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }),
    attachements: z.array(z.string()),
  }),
) {}

export const PaginatedDonationSchema = createPaginatedResponse(
  DonationSchema.extend({
    category: z.string(),
    location: LocationSchema.omit({
      id: true,
      updatedAt: true,
      createdAt: true,
    }),
    attachements: z.array(z.string()),
  }),
);

export class PaginatedDonationDto extends createZodDto(
  PaginatedDonationSchema,
) {}
