import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import z from 'zod';
import { createPaginatedResponse } from './utils/utils';

export const CommentPostSchema = extendApi(
  z.object({
    message: z.string().nonempty(),
  }),
);

export class CommentPostDto extends createZodDto(CommentPostSchema) {}

export const CommentSchema = extendApi(
  z.object({
    id: z.string(),
    createdAt: z.string(),
    fullName: z.string(),
    text: z.string(),
    userImage: z.string(),
  }),
);

export const CommentPaginatedSchema = createPaginatedResponse(CommentSchema);

export class CommentDto extends createZodDto(CommentSchema) {}
export class CommentPaginatedDto extends createZodDto(CommentPaginatedSchema) {}
