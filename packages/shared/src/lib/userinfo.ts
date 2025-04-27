import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import z from 'zod';

export const UserInfoSchema = extendApi(
  z.object({
    fullName: z.string().nullable(),
    email: z.string().nullable(),
    lastActiveAt: z.number().nullable(),
    avatar: z.string(),
    rating: z.number(),
  }),
);

export class UserInfoDto extends createZodDto(UserInfoSchema) {}
