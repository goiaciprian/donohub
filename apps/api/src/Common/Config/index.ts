import { string, z } from 'zod';

export const ConfigurationSchema = z.object({
  clerkPublishableKey: z.string(),
  clerkSecretKey: z.string(),
  databaseUrl: z.string(),
  authDisabled: z.boolean(),
  supabaseUrl: z.string(),
  supabaseApiKey: z.string(),
  deleteWebhookKey: z.string(),
  createWebhookKey: z.string(),
  apiKey: z.string(),
  updateWebhookKey: z.string(),
  vapid: z.object({
    sender: z.string(),
    privateKey: z.string(),
    publicKey: string(),
  })
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
    apiKey: process.env.API_KEY,
    updateWebhookKey: process.env.UPDATE_WEBHOOK_KEY,
    vapid: {
      privateKey: process.env.VAPID_PRIVATE_KEY,
      publicKey: process.env.VAPID_PUBLIC_KEY,
      sender: process.env.VAPID_SENDER,
    }
  };
};

export const load = () => {
  if (config === null) {
    config = getConfig();
  }
  return config;
};
