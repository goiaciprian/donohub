import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import { Configuration } from '../Config';

@Injectable()
export class WebhookRegisterGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<Configuration, true>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const webhook = new Webhook(this.configService.get('createWebhookKey'));

    try {
      webhook.verify(request.rawBody, request.headers);
      return true;
    } catch (e) {
      Logger.error(e);
      return false;
    }
  }
}

@Injectable()
export class WebhookDeleteGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<Configuration, true>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const webhook = new Webhook(this.configService.get('deleteWebhookKey'));

    try {
      webhook.verify(request.rawBody, request.headers);
      return true;
    } catch (e) {
      Logger.error(e);
      return false;
    }
  }
}

@Injectable()
export class WebhookUpdatedGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<Configuration, true>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const webhook = new Webhook(this.configService.get('updateWebhookKey'));

    try {
      webhook.verify(request.rawBody, request.headers);
      return true;
    } catch (e) {
      Logger.error(e);
      return false;
    }
  }
}

