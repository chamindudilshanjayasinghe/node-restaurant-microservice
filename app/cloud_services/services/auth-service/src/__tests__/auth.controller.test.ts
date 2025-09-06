import express from 'express';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { IUserRepository } from '../repositories/user.repository.interface';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import bodyParser from "body-parser";

const makeUser = (overrides: Partial<any> = {}) => ({
  id: 'u1',
  username: 'alice',
  email: 'a@a.com',
  passwordHash: bcrypt.hashSync('password123', 4),
  roles: ['USER'],
  status: 'ACTIVE',
  ...overrides,
});

function makeApp(repoImpl: Partial<IUserRepository> = {}) {
  const repo = {
    findByUsername: jest.fn(),
    create: jest.fn(),
    ...repoImpl,
  } as any as IUserRepository;

  const service = new AuthService(repo);
  const controller = new AuthController(service);

  const app = express();
  app.use(bodyParser.json());
  app.post('/api/auth/register', controller.register);
  app.post('/api/auth/login', controller.login);

  return { app, repo };
}

describe('AuthController HTTP', () => {
  test('POST /login → 200 with token', async () => {
    const { app, repo } = makeApp({
      findByUsername: jest.fn().mockResolvedValue(makeUser()),
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'alice', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  test('POST /login → 401 on invalid creds', async () => {
    const { app, repo } = makeApp({
      findByUsername: jest.fn().mockResolvedValue(makeUser({ passwordHash: bcrypt.hashSync('zzz', 4) })),
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'alice', password: 'password123' });

    expect(res.status).toBe(401);
  });

  test('POST /register → 201 on success', async () => {
    const { app, repo } = makeApp({
      findByUsername: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(makeUser()),
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'alice', password: 'password123', email: 'a@a.com' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(repo.create).toHaveBeenCalled();
  });

  test('POST /register → 409 when username taken', async () => {
    const { app } = makeApp({
      findByUsername: jest.fn().mockResolvedValue(makeUser()),
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'alice', password: 'password123' });

    expect(res.status).toBe(409);
  });
});
