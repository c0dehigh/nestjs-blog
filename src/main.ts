import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { appCreate } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appCreate(app);
}
bootstrap();
