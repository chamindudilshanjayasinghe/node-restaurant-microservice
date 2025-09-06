// src/routes/item.routes.ts (example usage)
import { Router } from "express";
import { ItemController } from "../controllers/item.controller";
import { itemRepository } from "../repositories/item.repository";
import { CreateItemDto, UpdateItemDto } from "../dtos/item.dto";
import { validateDto } from "shared-utils";

const router = Router();
const controller = new ItemController(itemRepository);

router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.post("/", validateDto(CreateItemDto), controller.create);
router.patch("/:id", validateDto(UpdateItemDto), controller.update);
router.delete("/:id", controller.remove);

export default router;
