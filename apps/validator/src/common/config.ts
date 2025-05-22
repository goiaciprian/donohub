import { cleanEnv, num, str } from "envalid";

const env = cleanEnv(process.env, {
  PORT: num({ default: 3005 }),
  DATABASE_URL: str(),
  OPEN_ROUTER_KEY: str(),
  MODEL_ID: str()
});

type Configuration = typeof env;

export class ConfigService {
  static loadConfiguration() {

    return new ConfigService(env);
  }

  private constructor(private readonly config: Configuration) {}

  get<K extends keyof Configuration>(key: K): Configuration[K] {
    return this.config[key];
  }
}
