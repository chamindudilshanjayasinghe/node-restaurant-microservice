// src/routes/order.routes.ts
import { Router } from "express";
import { OrderDto } from "../dtos/order.dto";
import { OrderController } from "../controllers/order.controller";
import { MongoOrderRepository } from "../repositories/order.repository";
import { validateDto } from "shared-utils";

const router = Router();
const repo = new MongoOrderRepository();
const controller = new OrderController(repo);

router.post("/", validateDto(OrderDto), controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getOne);

export default router;