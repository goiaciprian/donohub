import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi'
import { createZodDto } from '@anatine/zod-nestjs';

export const TestSchema = extendApi(z.object({
  'message': z.string()
}));

export class TestDto extends createZodDto(TestSchema) {};
export class PostTestDto extends createZodDto(TestSchema) {};
