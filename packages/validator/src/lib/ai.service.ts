import { Config, Context, Effect, Layer, Redacted } from 'effect';
import OpenAI from 'openai';
import { GenerationError } from './generation.error';

export class AiService extends Context.Tag('AiService')<
  AiService,
  {
    readonly getInitialResponse: (
      title: string,
      description: string,
      images: string[],
    ) => Effect.Effect<OpenAI.Chat.ChatCompletion, GenerationError>;
    readonly getConfirmedResponse: (
      title: string,
      description: string,
      images: string[],
      previous: 'APPROVED' | 'DECLINED',
    ) => Effect.Effect<OpenAI.Chat.ChatCompletion, GenerationError>;
  }
>() {}

export const AiServiceLive = Layer.effect(
  AiService,
  Effect.gen(function* () {
    const apiKey = yield* Config.redacted('OPEN_ROUTER_KEY');
    const aiModel = yield* Config.string('MODEL_ID');

    const openAi = new OpenAI({
      apiKey: Redacted.value(apiKey),
      baseURL: 'https://openrouter.ai/api/v1',
    });

    return {
      getInitialResponse: (title, description, images) =>
        Effect.tryPromise({
          try: () =>
            openAi.chat.completions.create({
              model: aiModel,
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
                      text: `Title: ${title} Description: ${description}`,
                    },
                    ...images.map(
                      (img) =>
                        ({
                          type: 'image_url',
                          image_url: {
                            url: img,
                          },
                        }) as OpenAI.Chat.Completions.ChatCompletionContentPart,
                    ),
                  ],
                },
              ],
            }),
          catch: (cause) => new GenerationError({ cause }),
        }),

      getConfirmedResponse: (title, description, images, previous) =>
        Effect.tryPromise({
          try: () =>
            openAi.chat.completions.create({
              model: aiModel,
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
                      text: `Title: ${title} Description: ${description}`,
                    },
                    ...images.map(
                      (img) =>
                        ({
                          type: 'image_url',
                          image_url: {
                            url: img,
                          },
                        }) as OpenAI.Chat.Completions.ChatCompletionContentPart,
                    ),
                    {
                      type: 'text',
                      text: `Previous response: ${previous}`,
                    },
                  ],
                },
              ],
            }),
          catch: (cause) => new GenerationError({ cause }),
        }),
    };
  }),
);

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
You use the previous response only for context, don't respond with *APPROVED* if you agreed with the response.
For example if the previous response is *DECLINED* and you agree with it then responde with *DECLINED*

`;
