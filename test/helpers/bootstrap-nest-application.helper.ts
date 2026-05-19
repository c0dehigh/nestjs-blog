import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { appCreate } from 'src/app.create';
import { ConfigService } from '@nestjs/config';
import { AppModule } from 'src/app.module';

export async function bootstrapNestApplication(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  //  providers: [ConfigService],
  }).compile();

  const app = moduleFixture.createNestApplication();
  appCreate(app);
  await app.init();
  return app;
}
