import { PrismaClient } from '@prisma/client';

type PrismaServiceOptions = ConstructorParameters<typeof PrismaClient>[0];

export const prismaClientFactoy = (opts: PrismaServiceOptions) => new PrismaClient(opts);