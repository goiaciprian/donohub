import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../Config';
import Express from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<Configuration, true>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Express.Request = context.switchToHttp().getRequest();

    if (
      process.env.NODE_ENV === 'development' ||
      request.path.includes('health')
    ) {
      return true;
    }

    const apiKey = request.cookies['api-key'] as string | null | undefined;
    if (!apiKey) {
      Logger.warn('Missing api-key');
      return false;
    }

    const trueApiKey = this.configService.get('apiKey');
    const correctApiKey = apiKey === trueApiKey;

    if (!correctApiKey) {
      Logger.warn('Invalid api-key');
    }

    return correctApiKey;
  }
}
