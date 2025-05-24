import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter, createContext, ConfigService, Logger } from '@donohub/validatorLib';

const server = createHTTPServer({
  router: appRouter,
  createContext,
});

const PORT = ConfigService.loadConfiguration().get('PORT');

server.listen(PORT, '::', undefined, () => {
  Logger.info(`Application listening on http://::${PORT}`);
});
