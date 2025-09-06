"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRepository = exports.ItemRepository = void 0;
const shared_mongoose_schemas_1 = require("shared-mongoose-schemas");
class ItemRepository {
    async create(data) {
        return shared_mongoose_schemas_1.Item.create(data);
    }
    async findById(id) {
        return shared_mongoose_schemas_1.Item.findById(id).exec();
    }
    async findOne(filter) {
        return shared_mongoose_schemas_1.Item.findOne(filter).exec();
    }
    async updateById(id, update) {
        return shared_mongoose_schemas_1.Item.findByIdAndUpdate(id, update, { new: true }).exec();
    }
    async softDelete(id, updatedBy) {
        return shared_mongoose_schemas_1.Item.findByIdAndUpdate(id, { status: "DELETED", updatedBy }, { new: true }).exec();
    }
    async list({ filter = {}, page = 1, limit = 10, sort = "-createdAt", projection, options = {}, lean = true, }) {
        let q = shared_mongoose_schemas_1.Item.find(filter, projection, options).sort(sort)
            .skip((page - 1) * limit).limit(limit);
        if (lean)
            q = q.lean();
        const [items, total] = await Promise.all([q.exec(), shared_mongoose_schemas_1.Item.countDocuments(filter).exec()]);
        return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit) || 1) };
    }
}
exports.ItemRepository = ItemRepository;
exports.itemRepository = new ItemRepository();
