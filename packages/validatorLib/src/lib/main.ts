import { initTRPC } from '@trpc/server';
import { Logger } from './common/logger';
import { Context } from './common/context';
import { validationInput } from './common/dto';
import { ee } from './common/event';
import { randomUUID } from 'node:crypto';
import z from 'zod';

const t = initTRPC.context<Context>().create();

const router = t.router;
const publicProcedure = t.procedure;

const loggerProcedure = publicProcedure.use(async (opts) => {
  const requestId = randomUUID();
  Logger.info(`REQUEST [${requestId}] (${opts.type}) /${opts.path}`);
  return opts.next({
    ctx: {
      requestId,
    },
  });
});

export const appRouter = router({
  health: loggerProcedure.query(async () => {
    return 'Ok';
  }),
  validate: loggerProcedure
    .input(validationInput)
    .output(z.string())
    .mutation(async (opts) => {
      ee.emit('validate', { ...opts.input, requestId: opts.ctx.requestId });
      return opts.ctx.requestId;
    }),
});

export type AppRouter = typeof appRouter;

export const callerFactory = t.createCallerFactory(appRouter)
