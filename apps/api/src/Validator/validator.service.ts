import { Configuration } from '@/Common/Config';
import { ValidationInput } from '@donohub/validatorLib';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class ValidatorService {
  private readonly validatorUrl: string;
  constructor(configService: ConfigService<Configuration>) {
    this.validatorUrl = configService.getOrThrow('validatorUrl');
  }

  async sendToValidation(input: ValidationInput) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json')

    await fetch(`${this.validatorUrl}/validate`, {
      method: 'POST',
      body: JSON.stringify(input),
      headers,
    })
      .then((response) => response.json())
      .then((responseRaw) => {
        Logger.log(`Ai validation request response: ${responseRaw}`);
      })
      .catch((reason) => {
        Logger.error(reason);
      });
  }
}
