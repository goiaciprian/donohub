import { Effect } from 'effect';
import { AiService, AiServiceLive } from './ai.service';
import { GenerationError } from './generation.error';

export type AiResponse = 'ACCEPTED' | 'DECLINED';

const _validateDonationProgram = (
  title: string,
  description: string,
  images: string[],
) =>
  Effect.gen(function* () {
    yield* Effect.logInfo('Stating validation');
    const aiService = yield* AiService;

    const initialResponse = yield* aiService.getInitialResponse(
      title,
      description,
      images,
    );

    if (
      !initialResponse ||
      !initialResponse.choices ||
      initialResponse.choices.length === 0 ||
      !initialResponse.choices[0].message
    ) {
      yield* Effect.logInfo("initial response chestie")
      return yield* new GenerationError({ cause: 'Initial response error' });
    }

    const message = initialResponse.choices[0].message;
    const isInitial = message.content?.includes('ACCEPTED') || false;
    yield* Effect.logInfo(
      `Initial reposonse is ${isInitial ? 'ACCEPTED' : 'DECLINED'}\n${message.content}`,
    );

    const confirmResponse = yield* aiService.getConfirmedResponse(
      title,
      description,
      images,
      isInitial ? 'ACCEPTED' : 'DECLINED',
    );
    if (
      !confirmResponse ||
      !confirmResponse.choices ||
      confirmResponse.choices.length === 0 ||
      !confirmResponse.choices[0]?.message
    ) {
      return yield* new GenerationError({ cause: 'Confirm response error' });
    }

    const confirmMessage = confirmResponse.choices[0].message;
    const isConfirmed = message.content?.includes('ACCEPTED') || false;
    yield* Effect.logInfo(
      `Confirm reposonse is ${isConfirmed ? 'ACCEPTED' : 'DECLINED'}\n${confirmMessage.content}`,
    );
    return isConfirmed && isInitial
      ? ('ACCEPTED' as const)
      : ('DECLINED' as const);
  }).pipe(
    Effect.provide(AiServiceLive),
    Effect.catch('_tag', {
      failure: 'GenerationError',
      onFailure: (error) =>
        Effect.gen(function* () {
          yield* Effect.logError(error);
          return 'DECLINED';
        }),
    }),
    Effect.catch('_tag', {
      failure: 'ConfigError',
      onFailure: (cause) => Effect.die(cause),
    }),
  );

export const validateDonation = async (
  title: string,
  description: string,
  images: string[],
): Promise<AiResponse> => {
  const response = await Effect.runPromise(
    _validateDonationProgram(title, description, images),
  );
  return response as AiResponse;
};
