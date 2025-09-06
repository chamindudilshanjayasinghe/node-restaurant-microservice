import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { userRepository } from "../repositories/user.repository";
import { LoginDto, RegisterDto } from "../dtos/auth.dto";
import { authGuard, validateDto } from "shared-utils";

const router = Router();
const controller = new AuthController(new AuthService(userRepository));

router.post("/register", validateDto(RegisterDto), controller.register);
router.post("/login", validateDto(LoginDto), controller.login);
router.get("/me", authGuard, controller.me);

export default router;
