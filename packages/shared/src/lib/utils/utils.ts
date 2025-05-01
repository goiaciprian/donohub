import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z, ZodSchema } from 'zod';

export const PaginationBaseSchema = extendApi(
  z.object({
    totalItems: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
    size: z.number(),
    page: z.number(),
  }),
);

export class PaginationBaseDto extends createZodDto(PaginationBaseSchema) {}

export const createPaginatedResponse = <S extends ZodSchema>(zodSchema: S) =>
  extendApi(
    PaginationBaseSchema.extend({
      items: z.array(zodSchema),
    }),
  );
