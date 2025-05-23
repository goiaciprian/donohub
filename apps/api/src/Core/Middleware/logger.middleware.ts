import { Logger } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common/interfaces';
import express from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: express.Request, res: express.Response, next: express.NextFunction) {
    const start = Date.now();
    const isSse = req.path.includes('sse');
    if (isSse) {
      Logger.log(`SSE ${req.path}`);
    } else {
      res.on('close', () =>
        Logger.log(
          `FINISH ${req.path} ${res.statusCode} +${Date.now() - start}`,
        ),
      );
    }
    res.on('error', () =>
      Logger.error(
        `ERROR ${req.path} ${res.statusCode} +${Date.now() - start}`,
      ),
    );
    next();
  }
}
