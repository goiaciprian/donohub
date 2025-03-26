import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CategorySchema = extendApi(
  z.object({
    id: z.string(),
    name: z.string(),
  }),
);

export class CategoryDto extends createZodDto(CategorySchema) {} 
