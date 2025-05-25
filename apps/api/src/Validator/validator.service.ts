import { ValidationInput } from '@donohub/validatorLib';
import { Logger } from '@nestjs/common';

export class ValidatorService {
  constructor(private readonly validatorUrl: string) {}

  async sendToValidation(input: ValidationInput) {
    await fetch(`${this.validatorUrl}/validate`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
      .then((response) =>
        Logger.log(`Ai validation request success: ${response.text()}`),
      )
      .catch((reason) => {
        Logger.error(`Error calling the ai service`, reason);
      });
  }
}
