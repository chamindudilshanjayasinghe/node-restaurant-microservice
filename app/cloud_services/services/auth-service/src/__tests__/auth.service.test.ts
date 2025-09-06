import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import type { IUserRepository } from '../repositories/user.repository.interface';
import test, { beforeEach, describe } from 'node:test';
import { create } from 'domain';
import { UserDocument, UserModel } from 'shared-mongoose-schemas';

// Minimal fake user document (what AuthService needs)
const makeUser = (overrides: Partial<UserDocument> = {} as any): UserDocument => {
  const base = {
    _id: "u1",
    username: "alice",
    email: "a@a.com",
    passwordHash: bcrypt.hashSync("password123", 4),
    roles: ["USER"],
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
  // creates a proper Mongoose document instance (no DB write)
  return UserModel.hydrate(base);
};
describe('AuthService', () => {
  let repo: jest.Mocked<IUserRepository>;
  let service: AuthService;

  beforeEach(() => {
    repo = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    } as any;
    service = new AuthService(repo);
  });

  test('register → success returns token + user', async () => {
    repo.findByUsername.mockResolvedValue(null);
    repo.create.mockResolvedValue(makeUser());

    const res = await service.register('alice', 'password123', 'a@a.com');

    expect(repo.findByUsername).toHaveBeenCalledWith('alice');
    expect(repo.create).toHaveBeenCalled();
    expect(res.token).toBeTruthy();
    const decoded = jwt.verify(res.token, process.env.JWT_SECRET!);
    expect((decoded as any).username).toBe('alice');
    expect(res.user.username).toBe('alice');
  });

  test('register → USERNAME_TAKEN', async () => {
    repo.findByUsername.mockResolvedValue(makeUser());
    await expect(service.register('alice', 'password123')).rejects.toThrow('USERNAME_TAKEN');
  });

  test('login → success returns token', async () => {
    repo.findByUsername.mockResolvedValue(makeUser());
    const res = await service.login('alice', 'password123');

    expect(res.token).toBeTruthy();
    const decoded = jwt.verify(res.token, process.env.JWT_SECRET!);
    expect((decoded as any).username).toBe('alice');
  });

  test('login → INVALID_CREDENTIALS if user not found', async () => {
    repo.findByUsername.mockResolvedValue(null);
    await expect(service.login('alice', 'password123')).rejects.toThrow('INVALID_CREDENTIALS');
  });

  test('login → INVALID_CREDENTIALS if wrong password', async () => {
    repo.findByUsername.mockResolvedValue(makeUser({ password: bcrypt.hashSync('zzz', 4) }));
    await expect(service.login('alice', 'password123')).rejects.toThrow('INVALID_CREDENTIALS');
  });

  test('login → USER_INACTIVE when status != ACTIVE', async () => {
    repo.findByUsername.mockResolvedValue(makeUser({ isActive: false }));
    await expect(service.login('alice', 'password123')).rejects.toThrow('USER_INACTIVE');
  });
});
