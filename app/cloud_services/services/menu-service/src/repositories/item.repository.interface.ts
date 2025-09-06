import { ItemDocument } from "shared-mongoose-schemas";
import { CreateItemDto, ListParams, PaginatedResult, UpdateItemDto } from "../dtos/item.dto";
import { FilterQuery } from "mongoose";

/* ---------- Interface ---------- */
export interface IItemRepository {
  create(data: CreateItemDto): Promise<ItemDocument>;
  findById(id: string): Promise<ItemDocument | null>;
  findOne(filter: FilterQuery<ItemDocument>): Promise<ItemDocument | null>;
  updateById(id: string, update: UpdateItemDto): Promise<ItemDocument | null>;
  softDelete(id: string, updatedBy: string): Promise<ItemDocument | null>;
  list(params: ListParams): Promise<PaginatedResult<ItemDocument | any>>;
}