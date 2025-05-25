import EventEmitter from 'node:events';
import { ConfigService } from './config';
import { prismaClientFactoy } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { ValidationInput } from './dto';
import { Logger } from './logger';
import axios from 'axios';
import ms from 'ms';

const configService = ConfigService.loadConfiguration();
const prismaService = prismaClientFactoy({
  datasourceUrl: configService.get('DATABASE_URL'),
});
const aiService = new AiService(
  configService.get('OPEN_ROUTER_KEY'),
  configService.get('MODEL_ID'),
);

export const ee = new EventEmitter();

ee.on('validate', async (data: ValidationInput & { requestId: string }) => {
  const start = new Date();
  const startUnix = start.getTime() / 1000;
  Logger.info(
    `AiFirstResponse [${data.requestId}] Start Ai validation for donation {${data.id}} - ${start.toISOString()}`,
  );

  const aiResponse = await aiService.sendForValidation(
    data.title,
    data.description,
    data.images,
  );

  const end = new Date();
  const endUnix = end.getTime() / 1000;
  Logger.info(
    `AiFirstResponse [${data.requestId}] Donation {${data.id}} defined as ${aiResponse.content} took ${ms(endUnix - startUnix)} - ${end.toISOString()}`,
  );

  const start2 = new Date();
  const start2Unix = start.getTime() / 1000;
  Logger.info(
    `AiSecondResponse [${data.requestId}] Start Ai validation for donation {${data.id}} - ${start2.toISOString()}`,
  );

  const isFirstOk = aiResponse.content?.includes('APPROVED') || false;

  const aiConfirmation = await aiService.sendForConfirmation(
    data.title,
    data.description,
    data.images,
    isFirstOk ? 'APPROVED' : 'DECLINED',
  );

  const end2 = new Date();
  const end2Unix = end.getTime() / 1000;
  Logger.info(
    `AiSecondResponse [${data.requestId}] Donation {${data.id}} confirmed as ${aiConfirmation.content} took ${ms(end2Unix - start2Unix)} - ${end2.toISOString()}`,
  );

  const isSecondOk = aiConfirmation.content?.includes('APPROVED') || false;
  const verdict = isFirstOk && isSecondOk ? 'APPROVED' : 'DECLINED';

  if (verdict === 'APPROVED') {
    await prismaService.donation.update({
      where: { id: data.id },
      data: { status: 'LISTED' },
    });
    Logger.info(
      `Prisma [${data.requestId}] Verdict is ok setting to donation to LISTED`,
    );
  }

  Logger.info(`REQUEST [${data.requestId}] completed`);

  await axios.post(`${configService.get('MAIN_URL')}/api/validatorResponse`, {
    id: data.id,
    clerkUserId: data.clerkUserId,
    content: verdict,
    requestId: data.requestId,
    title: data.title,
  });
});
