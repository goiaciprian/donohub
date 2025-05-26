import OpenAI from 'openai';
import { Logger } from '../common/logger';

export class AiService {
  private readonly MODEL_ID: string;
  private readonly openai: OpenAI;

  constructor(apiKey: string, modelId: string) {
    this.MODEL_ID = modelId;
    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
    });
  }

  async sendForValidation(
    title: string,
    description: string,
    images: string[],
  ) {
    const completion = await this.openai.chat.completions.create({
      model: this.MODEL_ID,
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: modelInstruction,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Title: ${title}\nDescription: ${description}
              `,
            },
            ...images.map((img) => ({
              type: 'image_url' as const,
              image_url: {
                url: img,
              },
            })),
          ],
        },
      ],
    });
    if ((completion?.choices?.length || 0) === 0) {
      Logger.error('No message received from ai.');
      return {
        content: 'DECLINED',
      };
    }

    return completion.choices[0].message;
  }

  async sendForConfirmation(
    title: string,
    description: string,
    images: string[],
    previousResponse: string | null,
  ) {
    const completion = await this.openai.chat.completions.create({
      model: this.MODEL_ID,
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: confirmationInstruction,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Title: ${title}\nDescription: ${description}\nPrevius agent response: ${previousResponse}`,
            },
            ...images.map((img) => ({
              type: 'image_url' as const,
              image_url: {
                url: img,
              },
            })),
          ],
        },
      ],
    });
    if ((completion?.choices?.length || 0) === 0) {
      Logger.error('No message received from ai.');
      return {
        content: 'DECLINED',
      };
    }
    return completion.choices[0].message;
  }
}

const modelInstruction = `
You will receive an input from users about different objects they want to donate, the input will contain:
- a title
- a description
- from 1 to 4 images

The user can input the title and description only in Romanian or English.

Translate the text from Romanian to English before you do any validation.

You're a very critic asistent, you need to check very carefully the following:

- the received title AND description does NOT have inappropriate language, insults or bad words.
- the received title AND description does NOT contain any selling reference, users are not allowed to sell items
- the received title AND description are in the same language
- the reveiced title match the description
- the received description match the title
- the received images match BOTH description and title, if the images have other objects or peoples in the background that's fine, make sure that the main object in the photo matches the title and the description
Do a double check before responding.

You will responde with exaclty *APPROVED* if you everything is all right and *DECLINED* if not.
`;

const confirmationInstruction = `
You are a very critic asistent that need to confirm the response another assistent gave

The other agent has received the following instructions:
${modelInstruction}

You will receive the save input as the other agent and the response it gave. If the previus agent has responded with *APPROVED* than you can safetly assume that he thinks the input matches all conditions.

You will responde with exaclty *APPROVED* if you agree that the other agent gave the correct response and *DECLINED* if not.
`;
