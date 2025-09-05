// src/repositories/order.repository.ts
import { ClientSession } from "mongoose";
import { OrderDto } from "../dtos/order.dto";
import { OrderDocument } from "shared-mongoose-schemas";

export interface ListParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IOrderRepository {
  withSession<T>(fn: (session: ClientSession) => Promise<T>): Promise<T>;

  findById(id: string): Promise<OrderDocument | null>;
  findPaginated(params: ListParams): Promise<{ items: OrderDocument[]; total: number; page: number; limit: number }>;

  existsByOrderNo(orderNo: string): Promise<boolean>;
  findByIdempotencyKey(key: string): Promise<OrderDocument | null>;

  create(dto: OrderDto, ctx: { userId?: string; idempotencyKey?: string | null }, session?: ClientSession): Promise<OrderDocument>;

  update(id: string, dto: OrderDto, ctx: { userId?: string }, session?: ClientSession): Promise<OrderDocument>;
}
