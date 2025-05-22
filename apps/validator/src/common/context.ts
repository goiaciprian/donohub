import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { ConfigService } from './config';
import { prismaClientFactoy } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

export const createContext = async (_opts: CreateNextContextOptions) => {
  const configService = ConfigService.loadConfiguration();
  const prismaService = prismaClientFactoy({
    datasourceUrl: configService.get('DATABASE_URL'),
  });
  const aiService = new AiService(configService.get('OPEN_ROUTER_KEY'), configService.get('MODEL_ID'));

  return {
    configService,
    prismaService,
    aiService,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
