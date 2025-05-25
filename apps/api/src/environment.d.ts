declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      DATABASE_URL: string;
      SUPABASE_URL: string;
      SUPABASE_API_KEY: string;
      DELETE_WEBHOOK_KEY: string;
      CREATE_WEBHOOK_KEY: string;
      API_KEY: string;
      VALIDATOR_URL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
