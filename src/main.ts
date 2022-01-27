import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const logStream = fs.createWriteStream('api.log', {
  flags: 'a', // append
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By');
    next();
  });
  app.use(morgan('tiny', { stream: logStream }));
  await app.listen(3000);
}
bootstrap();
