import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression'
import * as cookie from 'cookie-parser'
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())
  app.use(compression())
  app.enableCors()
  app.use(cookie())
  app.use(helmet())

  await app.listen(3000);
}
bootstrap();
