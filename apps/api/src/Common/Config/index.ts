import { z } from 'zod';

export const ConfigurationSchema = z.object({
  clerkPublishableKey: z.string(),
  clerkSecretKey: z.string(),
  databaseUrl: z.string(),
  authDisabled: z.boolean(),
  supabaseUrl: z.string(),
  supabaseApiKey: z.string(),
  deleteWebhookKey: z.string(),
  createWebhookKey:z.string(), 
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

let config: Configuration | null = null;

const getConfig = (): Configuration => {
  return {
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    databaseUrl: process.env.DATABASE_URL,
    authDisabled: process.env.AUTH_DISABLED ? true : false,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseApiKey: process.env.SUPABASE_API_KEY,
    createWebhookKey: process.env.CREATE_WEBHOOK_KEY,
    deleteWebhookKey: process.env.DELETE_WEBHOOK_KEY,
  };
};

export const load = () => {
  if (config === null) {
    config = getConfig();
  }
  return config;
};
