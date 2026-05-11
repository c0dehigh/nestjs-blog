import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /**
   * swagger configuration
   */

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJs - Blog app API')
    .setDescription('Use the base api url http://localhost:3000')
    .setTermsOfService('http://localhost:3000/termis-of-service')
    .addServer('http://localhost:3000')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Setup the aws sdk used uploading the files to aws s3 bucket
  const configService = app.get<ConfigService>(ConfigService);

  const accessKeyId =
    configService.get<string>('appConfig.awsAccessKeyId') ?? '';
  const secretAccessKey =
    configService.get<string>('appConfig.awsSecretAccessKey') ?? '';
  const region =
    configService.get<string>('appConfig.awsRegion') ?? 'us-east-1';
  config.update({
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region,
  });
  // Enable Cors
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
