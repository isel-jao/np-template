import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // validation pipeline
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),

  const config = new DocumentBuilder()
    .setTitle('npp API')
    .setDescription('NestJs Prisma Postgresql Template')
    .setVersion('1.0')
    .addTag('isel-jao')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/v1/docs', app, document);

  await app.listen(3000);
}
bootstrap();
