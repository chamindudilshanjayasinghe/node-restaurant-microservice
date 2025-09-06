import { Request, Response } from "express";
import { CreateItemDto, UpdateItemDto } from "../dtos/item.dto";
import { IItemRepository } from "../repositories/item.repository.interface";

type AuthedRequest = Request & { user?: { id?: string } };

export class ItemController {
  constructor(private readonly repo: IItemRepository) {}

  // POST /api/items
  create = async (req: AuthedRequest, res: Response) => {
    const dto = req.body as CreateItemDto;
    const userId = req.user?.id;

    if (!dto.name || dto.price == null) {
      return res.status(400).json({ message: "name and price are required" });
    }

    try {
      const item = await this.repo.create({
        ...dto,
        createdBy: userId!,
        updatedBy: userId!,
      });
      res.status(201).json(item);
    } catch (e: any) {
      if (e?.code === 11000) {
        return res.status(409).json({ message: "Item already exists", conflict: e.keyValue });
      }
      res.status(500).json({ message: "Failed to create item", error: e?.message });
    }
  };

  // GET /api/items
  list = async (req: Request, res: Response) => {
    try {
      const {
        search = "",
        status,
        page = "1",
        limit = "20",
        sort = "-createdAt",
      } = req.query;

      const filter: any = {};
      if (status) filter.status = status;
      else filter.status = { $ne: "DELETED" };
      if (search) filter.name = { $regex: search, $options: "i" };

      const result = await this.repo.list({
        filter,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sort: sort as string,
      });

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to fetch items", error: e?.message });
    }
  };

  // GET /api/items/:id
  getOne = async (req: Request, res: Response) => {
    try {
      const item = await this.repo.findById(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (e: any) {
      res.status(400).json({ message: "Invalid ID format", error: e?.message });
    }
  };

  // PATCH /api/items/:id
  update = async (req: AuthedRequest, res: Response) => {
    const dto = req.body as UpdateItemDto;
    const userId = req.user?.id;

    try {
      const updated = await this.repo.updateById(req.params.id, {
        ...dto,
        updatedBy: userId!,
      });
      if (!updated) return res.status(404).json({ message: "Item not found" });
      res.json(updated);
    } catch (e: any) {
      if (e?.code === 11000) {
        return res.status(409).json({ message: "Item already exists", conflict: e.keyValue });
      }
      res.status(500).json({ message: "Failed to update item", error: e?.message });
    }
  };

  // DELETE /api/items/:id
  remove = async (req: AuthedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const item = await this.repo.softDelete(req.params.id, userId!);
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json({ message: "Item deleted", data: item });
    } catch (e: any) {
      res.status(400).json({ message: "Invalid ID format", error: e?.message });
    }
  };
}
