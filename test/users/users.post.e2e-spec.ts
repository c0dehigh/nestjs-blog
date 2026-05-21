import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { bootstrapNestApplication } from 'test/helpers/bootstrap-nest-application.helper';
import {
  completeUser,
  missingEmail,
  missingFirstName,
  missingPassword,
} from './users.post.e2e-spec.sample-data';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication<App>;
  let config: ConfigService;
  let httpServer: App;

  beforeEach(async () => {
    // Instantiation the application
    app = await bootstrapNestApplication();

    // Extract the config
    config = app.get<ConfigService>(ConfigService);

    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    if (config) await dropDatabase(config);
    if (app) await app.close();
  });

  it('/users - endpoint is public', async () => {
    return await request(httpServer).post('/users').send({}).expect(400);
  });
  it('/users - firstName is mandatory', async () => {
    return await request(httpServer)
      .post('/users')
      .send(missingFirstName)
      .expect(400);
  });
  it('/users - email is mandatory', async () => {
    return await request(httpServer)
      .post('/users')
      .send(missingEmail)
      .expect(400);
  });
  it('/users - password is mandatory', async () => {
    return await request(httpServer)
      .post('/users')
      .send(missingPassword)
      .expect(400);
  });
  it('/users - Valid request successfully create user', async () => {
    return await request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data.firstName).toBe(completeUser.firstName);
        expect(body.data.lastName).toBe(completeUser.lastName);
        expect(body.data.email).toBe(completeUser.email);
      });
  });
  it('/users - password is not returned in response', async () => {
    return await request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.password).toBeUndefined();
      });
  });
  it('/users - googleId is not returned in response', async () => {
    return await request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.googleId).toBeUndefined();
      });
  });
});
