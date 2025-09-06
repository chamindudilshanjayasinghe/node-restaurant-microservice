import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";

type AuthedRequest = Request & { user?: { id: string; username: string; roles: string[] } };

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response) => {
    const dto = req.body as RegisterDto;
    try {
      const result = await this.service.register(dto.username, dto.password, dto.email);
      return res.status(201).json(result);
    } catch (e: any) {
      if (e.message === "USERNAME_TAKEN") return res.status(409).json({ message: "Username already exists" });
      return res.status(400).json({ message: "Registration failed", error: e?.message });
    }
  };

  login = async (req: Request, res: Response) => {
    const dto = req.body as LoginDto;
    try {
      const result = await this.service.login(dto.username, dto.password);
      return res.json(result);
    } catch (e: any) {
      const map: Record<string, number> = { INVALID_CREDENTIALS: 401, USER_INACTIVE: 403 };
      return res.status(map[e.message] || 400).json({ message: e.message });
    }
  };

  // example protected route
  me = async (req: AuthedRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json({ user: req.user });
  };
}
