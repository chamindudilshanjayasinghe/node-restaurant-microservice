// src/controllers/order.controller.ts
import { Request, Response } from "express";
import { OrderDto } from "../dtos/order.dto";
import { IOrderRepository } from "../repositories/order.repository.interface";

type AuthedRequest = Request & { user?: { id?: string } };

const sum = (items: { total: number }[]) => items.reduce((s, it) => s + (it?.total ?? 0), 0);

export class OrderController {
  constructor(private readonly repo: IOrderRepository) {}

  // POST /api/orders
  create = async (req: AuthedRequest, res: Response) => {
    const dto = req.body as OrderDto;
    const idemKey = (req.header("idempotency-key") || "").trim() || null;

    // business checks
    if (!dto.items?.length) return res.status(400).json({ message: "items cannot be empty" });
    for (const it of dto.items) {
      const expected = it.price * it.quantity;
      if (it.total !== expected) return res.status(400).json({ message: `Invalid total for item ${it.itemId}` });
    }
    const itemsSum = sum(dto.items);
    if (itemsSum !== dto.totalAmount) return res.status(400).json({ message: `totalAmount (${dto.totalAmount}) != sum(items.total) (${itemsSum})` });
    if (dto.paidAmount > dto.totalAmount) return res.status(400).json({ message: "paidAmount cannot exceed totalAmount" });

    try {
      if (idemKey) {
        const exist = await this.repo.findByIdempotencyKey(idemKey);
        if (exist) return res.status(200).json(exist);
      }
      if (await this.repo.existsByOrderNo(dto.orderNo)) {
        return res.status(409).json({ message: "orderNo already exists" });
      }
      const doc = await this.repo.create(dto, { userId: req.user?.id, idempotencyKey: idemKey });
      res.status(201).json(doc);
    } catch (e: any) {
      res.status(500).json({ message: "Failed to create order", error: e?.message });
    }
  };

  // GET /api/orders
  list = async (req: Request, res: Response) => {
    const data = await this.repo.findPaginated({
      status: (req.query.status as string) || undefined,
      search: (req.query.search as string) || undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
    });
    res.json({ ...data, pages: Math.ceil(data.total / data.limit) });
  };

  // GET /api/orders/:id
  getOne = async (req: Request, res: Response) => {
    const doc = await this.repo.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Order not found" });
    res.json(doc);
  };
}
