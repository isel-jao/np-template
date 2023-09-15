import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NotFoundInterceptor } from './common/interceptors/notfound.interceptors';
import { PrismaClientValidationFilter } from './common/filters/prismaclientvalidation.filter';
import env from './common/env';
import { PrismaClientErrorFilter } from './common/filters/prismaClientKnownRequestError.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors
  app.enableCors();

  // enable validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // enable prisma client validation filter
  app.useGlobalFilters(new PrismaClientValidationFilter());

  // enable not found interceptor
  app.useGlobalInterceptors(new NotFoundInterceptor());

  app.useGlobalFilters(new PrismaClientErrorFilter());

  // swagger
  const config = new DocumentBuilder()
    .setTitle('np api')
    .setDescription('<h1>API Documentation</h1>')
    .setVersion('1.0')
    .addTag('isel-jao')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // start app
  await app.listen(env.PORT);
}
bootstrap();
