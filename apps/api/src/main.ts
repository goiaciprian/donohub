import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/App/app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const documentConfig = new DocumentBuilder()
    .setTitle('DonoHUB API')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('/api/swagger', app, () => document, {
    customSiteTitle: 'DonoHUB Api',
  });
  app.use(
    '/api/ref',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  const port = process.env.PORT_BE || 3001;
  await app.listen(port);

  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
