import z from 'zod';

export const validationInput = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  title: z.string(),
  description: z.string(),
  images: z.array(z.string()),
});

export type ValidationInput = z.infer<typeof validationInput>;

export const responseOutput = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  content: z.string().nullable(),
  requestId: z.string(),
  title: z.string(),
});

export type ResponseOutput = z.infer<typeof responseOutput>;
