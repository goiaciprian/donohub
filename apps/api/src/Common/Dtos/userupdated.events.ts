import { createZodDto } from "@anatine/zod-nestjs";
import z from "zod";


export const DataSchema = z.object({
    "first_name": z.string(),
    "id": z.string(),
    "image_url": z.string(),
    "last_name": z.string().nullable().optional(),
});
export type Data = z.infer<typeof DataSchema>;

export const UserUpdateEventSchema = z.object({
    "data": DataSchema,
});
export type UserUpdateEvent = z.infer<typeof UserUpdateEventSchema>;

export class UserUpdatedEvent extends createZodDto(UserUpdateEventSchema) {};
