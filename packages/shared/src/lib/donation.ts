import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import z from 'zod';
import { LocationSchema } from './location';
import { createPaginatedResponse } from './utils/utils';

export const DonationStatus = extendApi(
  z.enum([
    'UNLISTED',
    'LISTED',
    'IN_PROGRESS',
    'RESOLVED',
    'NEEDS_WORK',
    'USER_UPDATED',
  ]),
);

export type DonationStatusEnum = z.infer<typeof DonationStatus>;

export const DonationEvaluationSchema = extendApi(
  z.enum(['ACCEPTED', 'DECLINED']),
);

export type DonationEvaluationType = z.infer<typeof DonationEvaluationSchema>;

export const DonationSchema = extendApi(
  z.object({
    id: z.string(),
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    quantity: z.string().nullable().default(null),
    phone: z.string().nullable().default(null),
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
    requestedUser: z.array(z.string())
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

export const DonationEvaluateScheme = extendApi(
  z.object({
    id: z.string(),
    clerkUserId: z.string(),
    userImage: z.string(),
    userName: z.string(),
    approved: z.boolean(),
    comment: z.string().nullable(),
    createdAt: z.date(),
  }),
);

export const PaginatedEvaluatedDonationScheme = createPaginatedResponse(
  DonationSchema.extend({
    categoryId: z.string(),
    locationId: z.string(),
    category: z.string(),
    location: LocationSchema.omit({
      id: true,
      updatedAt: true,
      createdAt: true,
    }),
    attachements: z.array(z.string()),
    evaluations: z.array(DonationEvaluateScheme),
  }),
);

export class PaginatedEvaluatedDonationDto extends createZodDto(
  PaginatedEvaluatedDonationScheme,
) {}

export const PutDonationEvaluationSchema = extendApi(
  z.object({
    comment: z.string().optional().nullable(),
  }),
);

export class PutDonationEvaluationDto extends createZodDto(
  PutDonationEvaluationSchema,
) {}

export class UpdateDonationDto extends createZodDto(
  PostDonationSchema.partial(),
) {}

export const DonationRequestByUserSchema = extendApi(
  z.object({
    id: z.string(),
    createdAt: z.date(),
    donationId: z.string(),
    donationTitle: z.string(),
    donationUserId: z.string(),
    comment: z.string().nullable(),
    status: DonationEvaluationSchema,
  }),
);

export class PaginatedDonationRequestByUserDto extends createZodDto(
  createPaginatedResponse(DonationRequestByUserSchema)
) {}

export const DonationUserRequestsSchema = extendApi(
  z.object({
    id: z.string(),
    createdAt: z.date(),
    donationId: z.string(),
    donationName: z.string(),
    userName: z.string(),
    userImage: z.string(),
    comment: z.string().nullable(),
    status: DonationEvaluationSchema,
  }),
);

export class PaginatedDonationUserRequestsDto extends createZodDto(
  createPaginatedResponse(z.object({
    id: z.string(),
    title: z.string(),
    requests: z.array(z.object({
      id: z.string(),
      createdAt: z.date(),
      clerkUserId: z.string(),
      userImage: z.string(),
      userName: z.string(),
      comment: z.string().nullable(),
      status: DonationEvaluationSchema,
    }))
  })),
) {}

export class PutDonationRequestDto extends createZodDto(
  extendApi(
    z.object({
      comment: z.string().nullable(),
    }),
  ),
) {}
