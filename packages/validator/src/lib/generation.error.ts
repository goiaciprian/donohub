import { Data } from "effect";

export class GenerationError extends Data.TaggedError('GenerationError')<{
  cause: unknown;
}> {}


