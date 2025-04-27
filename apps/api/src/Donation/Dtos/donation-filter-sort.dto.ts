import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const DonationFilterSortSchema = extendApi(
  z.object({
    location: z.string().optional(),
    category: z.string().optional(),
    q: z.string().optional(),
  }),
);

export class DonationFilterSortDto extends createZodDto(
  DonationFilterSortSchema,
) {}
