import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';


describe('AuthService Integration (mongodb-memory-server)', () => {
  let mongod: MongoMemoryServer;
  let app: express.Express;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());

    const repo = new UserRepository();
    const service = new AuthService(repo);
    const controller = new AuthController(service);

    app = express();
    app.use(bodyParser.json());
    app.post('/api/auth/register', controller.register);
    app.post('/api/auth/login', controller.login);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  test('register → login roundtrip', async () => {
    const reg = await request(app).post('/api/auth/register').send({ username: 'bob', password: 'passw0rd' });
    expect(reg.status).toBe(201);
    expect(reg.body.token).toBeTruthy();

    const login = await request(app).post('/api/auth/login').send({ username: 'bob', password: 'passw0rd' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  });
});
