import z from "zod";

export const PermissionsSchema = z.enum(['donation:evaluate', 'comments:evaluate'])

export type PermissionsType = z.infer<typeof PermissionsSchema>