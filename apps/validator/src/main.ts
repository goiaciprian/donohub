import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { Logger } from './common/logger';
import { Context, createContext } from './common/context';
import { ConfigService } from './common/config';
import z from 'zod';
import EventEmitter, { on } from 'node:events';

const t = initTRPC.context<Context>().create();

const ee = new EventEmitter();

const router = t.router;
const publicProcedure = t.procedure;

const loggerProcedure = publicProcedure.use(async (opts) => {
  Logger.info(`REQUEST (${opts.type}) /${opts.path}`);
  return opts.next();
});

const appRouter = router({
  health: loggerProcedure.query(async () => {
    return 'Ok';
  }),
  validation: loggerProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        images: z.array(z.string()),
      }),
    )
    .mutation(async (opts) => {
      const { aiService } = opts.ctx;
      const { images, title, description } = opts.input;
      return aiService.sendForValidation(title, description, images);
    }),
  add: loggerProcedure
    .input(z.object({ input: z.string() }))
    .mutation(async (opts) => {
      ee.emit('add', opts.input.input);
      return 1;
    }),
  response: loggerProcedure.subscription(async function* (opts) {
    for await (const [data] of on(ee, 'add', {
      signal: opts.signal,
    })) {
      yield data;
    }
  }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

const PORT = ConfigService.loadConfiguration().get('PORT');

server.listen(PORT, '::', undefined, () => {
  Logger.info(`Application listening on http://::${PORT}`);
});
