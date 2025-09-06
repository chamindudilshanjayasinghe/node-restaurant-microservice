import { Item, ItemDocument } from "shared-mongoose-schemas";
import { CreateItemDto, ListParams, PaginatedResult, UpdateItemDto } from "../dtos/item.dto";
import { IItemRepository } from "./item.repository.interface";
import { FilterQuery, UpdateQuery } from "mongoose";

export class ItemRepository implements IItemRepository {
  async create(data: CreateItemDto): Promise<ItemDocument> {
    return Item.create(data as any);
  }

  async findById(id: string): Promise<ItemDocument | null> {
    return Item.findById(id).exec();
  }

  async findOne(filter: FilterQuery<ItemDocument>): Promise<ItemDocument | null> {
    return Item.findOne(filter).exec();
  }

  async updateById(id: string, update: UpdateItemDto): Promise<ItemDocument | null> {
    return Item.findByIdAndUpdate(id, update as UpdateQuery<ItemDocument>, { new: true }).exec();
  }

  async softDelete(id: string, updatedBy: string): Promise<ItemDocument | null> {
    return Item.findByIdAndUpdate(id, { status: "DELETED", updatedBy } as any, { new: true }).exec();
  }

  async list({
    filter = {},
    page = 1,
    limit = 10,
    sort = "-createdAt",
    projection,
    options = {},
    lean = true,
  }: ListParams): Promise<PaginatedResult<ItemDocument | any>> {
    let q:any = Item.find(filter, projection, options).sort(sort)
      .skip((page - 1) * limit).limit(limit);
    if (lean) q = q.lean();

    const [items, total] = await Promise.all([q.exec(), Item.countDocuments(filter).exec()]);
    return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit) || 1) };
  }
}

export const itemRepository: IItemRepository = new ItemRepository();