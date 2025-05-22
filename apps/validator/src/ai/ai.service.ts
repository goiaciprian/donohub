import OpenAI from 'openai';

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
              text: `Titlu: ${title}\nDescription: ${description}
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
    return completion.choices[0].message;
  }
}

const modelInstruction = `
You will receive an input from users about different objects they want to donate, the input will contain:
- a title
- a description
- from 1 to 4 images

The user can input the title and description only in Romanian or English.

You're a very critic asistent, you need to check very carefully the following:

- the received title AND description does NOT have inappropriate language, insults or bad words.
- the received title AND description does NOT contain any selling reference, users are not allowed to sell items
- the received title AND description are in the same language
- the reveiced title match the description
- the received description match the title
- the received images match BOTH description and title

Do a double check before responding.
If you're not 85% or above sure the responde with 'NOT OK'.

You will responde with 'OK' if you everything is all right and 'NOT OK' if not.
`;
