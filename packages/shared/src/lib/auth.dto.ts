import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi'
import { createZodDto } from '@anatine/zod-nestjs';

export const LoginBody = extendApi(z.object({
  'email': z.string(),
  'password': z.string()
}));

export class LoginBodyDto extends createZodDto(LoginBody) {};
