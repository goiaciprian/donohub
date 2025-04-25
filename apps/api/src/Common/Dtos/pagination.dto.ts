import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { z } from "zod";

export const PaginationSchema = extendApi(z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(20),
}));

export class PaginationQueryDto extends createZodDto(PaginationSchema) {} 