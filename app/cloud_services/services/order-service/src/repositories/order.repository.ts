// src/repositories/order.repository.mongo.ts
import { ClientSession, FilterQuery, startSession } from "mongoose";
import { OrderDto } from "../dtos/order.dto";
import { IOrderRepository, ListParams } from "./order.repository.interface";
import { Order } from "shared-mongoose-schemas";

export class MongoOrderRepository implements IOrderRepository {
  async withSession<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await startSession();
    try {
      let result!: T;
      await session.withTransaction(async () => {
        result = await fn(session);
      });
      return result;
    } finally {
      session.endSession();
    }
  }

  async findById(id: string) {
    return Order.findById(id);
  }

  async findPaginated({ status, search, page = 1, limit = 20 }: ListParams) {
    const filter: FilterQuery<any> = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNo: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Order.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  async existsByOrderNo(orderNo: string) {
    const c = await Order.countDocuments({ orderNo });
    return c > 0;
  }

  async findByIdempotencyKey(key: string) {
    return Order.findOne({ "meta.idempotencyKey": key }).lean();
  }

  async create(dto: OrderDto, ctx: { userId?: string; idempotencyKey?: string | null }, session?: ClientSession) {
    const [doc] = await Order.create([{
      ...dto,
      createdBy: ctx.userId,
      updatedBy: ctx.userId,
      meta: { idempotencyKey: ctx.idempotencyKey ?? null }
    }], { session });

    return doc;
  }

  async update(id: string, dto: OrderDto, ctx: { userId?: string }, session?: ClientSession) {
    const doc = await Order.findById(id).session(session || null);
    if (!doc) throw new Error("NOT_FOUND");

    // immutable guard handled in controller; here we just assign
    if (dto.items !== undefined) (doc as any).items = dto.items;
    if (dto.totalAmount !== undefined) (doc as any).totalAmount = dto.totalAmount;
    if (dto.paidAmount !== undefined) (doc as any).paidAmount = dto.paidAmount;
    if (dto.orderType !== undefined) (doc as any).orderType = dto.orderType;
    if (dto.status !== undefined) (doc as any).status = dto.status;
    if (dto.paymentStatus !== undefined) (doc as any).paymentStatus = dto.paymentStatus;

    doc.updatedBy = ctx.userId as any;
    await doc.save({ session });
    return doc;
  }
}
