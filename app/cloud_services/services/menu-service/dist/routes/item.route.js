"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/item.routes.ts (example usage)
const express_1 = require("express");
const item_controller_1 = require("../controllers/item.controller");
const item_repository_1 = require("../repositories/item.repository");
const item_dto_1 = require("../dtos/item.dto");
const shared_utils_1 = require("shared-utils");
const router = (0, express_1.Router)();
const controller = new item_controller_1.ItemController(item_repository_1.itemRepository);
router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.post("/", (0, shared_utils_1.validateDto)(item_dto_1.CreateItemDto), controller.create);
router.patch("/:id", (0, shared_utils_1.validateDto)(item_dto_1.UpdateItemDto), controller.update);
router.delete("/:id", controller.remove);
exports.default = router;
