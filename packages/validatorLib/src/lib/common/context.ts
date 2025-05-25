import { CreateNextContextOptions } from '@trpc/server/adapters/next';

export const createContext = async (_opts: CreateNextContextOptions) => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
