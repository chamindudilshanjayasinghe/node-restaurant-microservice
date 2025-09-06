import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUserRepository } from "../repositories/user.repository.interface";
import { UserDocument } from "shared-mongoose-schemas";

type JwtPayload = { sub: string; username: string; roles: string[] };

export class AuthService {
  constructor(private readonly users: IUserRepository) {}

  async register(username: string, password: string, email?: string) {
    const exist = await this.users.findByUsername(username);
    if (exist) throw new Error("USERNAME_TAKEN");
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.create({ username, email, passwordHash, roles: ["USER"] });
    return this.issue(user);
  }

  async login(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    if (!user) throw new Error("INVALID_CREDENTIALS");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("INVALID_CREDENTIALS");
    return this.issue(user);
  }

  private issue(user: UserDocument) {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = process.env.JWT_EXPIRES || "1d";
    const payload: JwtPayload = { sub: user.id, username: user.email, roles: [user.role] };
    const token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 });
    return {
      token,
      user: { id: user.id, username: user.email, email: user.email, roles: [user.role] },
      expiresIn,
    };
  }
}
