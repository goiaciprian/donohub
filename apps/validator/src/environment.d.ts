declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      OPEN_ROUTER_KEY: string;
      MODEL_ID: string;
    }
  }
}

export {};