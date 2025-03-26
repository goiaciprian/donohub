import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { z } from "zod";

export const PaginationSchema = extendApi(z.object({
    page: z.number().default(1),
    size: z.number().default(20),
}));

export class PaginationQueryDto extends createZodDto(PaginationSchema) {} 