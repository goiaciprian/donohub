import { extendApi } from '@anatine/zod-openapi';
import { z, ZodSchema } from 'zod';

export const createPaginatedResponse = <S extends ZodSchema,>(zodSchema: S) =>
  extendApi(
    z.object({
      totalItems: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
      size: z.number(),
      page: z.number(),
      items: z.array(zodSchema),
    }),
  );
