"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
class ItemController {
    constructor(repo) {
        this.repo = repo;
        // POST /api/items
        this.create = async (req, res) => {
            const dto = req.body;
            const userId = req.user?.id;
            if (!dto.name || dto.price == null) {
                return res.status(400).json({ message: "name and price are required" });
            }
            try {
                const item = await this.repo.create({
                    ...dto,
                    createdBy: userId,
                    updatedBy: userId,
                });
                res.status(201).json(item);
            }
            catch (e) {
                if (e?.code === 11000) {
                    return res.status(409).json({ message: "Item already exists", conflict: e.keyValue });
                }
                res.status(500).json({ message: "Failed to create item", error: e?.message });
            }
        };
        // GET /api/items
        this.list = async (req, res) => {
            try {
                const { search = "", status, page = "1", limit = "20", sort = "-createdAt", } = req.query;
                const filter = {};
                if (status)
                    filter.status = status;
                else
                    filter.status = { $ne: "DELETED" };
                if (search)
                    filter.name = { $regex: search, $options: "i" };
                const result = await this.repo.list({
                    filter,
                    page: parseInt(page, 10),
                    limit: parseInt(limit, 10),
                    sort: sort,
                });
                res.json(result);
            }
            catch (e) {
                res.status(500).json({ message: "Failed to fetch items", error: e?.message });
            }
        };
        // GET /api/items/:id
        this.getOne = async (req, res) => {
            try {
                const item = await this.repo.findById(req.params.id);
                if (!item)
                    return res.status(404).json({ message: "Item not found" });
                res.json(item);
            }
            catch (e) {
                res.status(400).json({ message: "Invalid ID format", error: e?.message });
            }
        };
        // PATCH /api/items/:id
        this.update = async (req, res) => {
            const dto = req.body;
            const userId = req.user?.id;
            try {
                const updated = await this.repo.updateById(req.params.id, {
                    ...dto,
                    updatedBy: userId,
                });
                if (!updated)
                    return res.status(404).json({ message: "Item not found" });
                res.json(updated);
            }
            catch (e) {
                if (e?.code === 11000) {
                    return res.status(409).json({ message: "Item already exists", conflict: e.keyValue });
                }
                res.status(500).json({ message: "Failed to update item", error: e?.message });
            }
        };
        // DELETE /api/items/:id
        this.remove = async (req, res) => {
            try {
                const userId = req.user?.id;
                const item = await this.repo.softDelete(req.params.id, userId);
                if (!item)
                    return res.status(404).json({ message: "Item not found" });
                res.json({ message: "Item deleted", data: item });
            }
            catch (e) {
                res.status(400).json({ message: "Invalid ID format", error: e?.message });
            }
        };
    }
}
exports.ItemController = ItemController;
