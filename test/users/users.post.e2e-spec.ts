import  request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { bootstrapNestApplication } from 'test/helpers/bootstrap-nest-application.helper';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication<App>;
  let config: ConfigService;
  let httpServer:App

  beforeEach(async () => {
    // Instantiation the application
    app = await bootstrapNestApplication();

    // Extract the config
    config = app.get<ConfigService>(ConfigService);
    
    httpServer = app.getHttpServer()
  });

  afterEach(async () => {
    if(config) await dropDatabase(config);
    if (app) await app.close();

  });

  it('/users - endpoint is public', async ()=> {
    return await request(httpServer).post('/users').send({}).expect(400).then((data)=>{
      console.log(data.body);
    })
  })
  it.todo('/users - firstName is mandatory');
  it.todo('/users - email is mandatory');
  it.todo('/users - password is mandatory');
  it.todo('/users - Valid request successfully create user');
  it.todo('/users - password is not returned in response');
  it.todo('/users - googleId is not returned in response');
});
