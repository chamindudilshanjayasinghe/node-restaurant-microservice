"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_client_1 = require("mongoose-client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)(); // ✅ now express is defined
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('🍔 Order Service is running');
});
async function bootstrap() {
    try {
        await (0, mongoose_client_1.connectDB)(process.env.MONGO_URI || 'mongodb://localhost:27017/rms-menu-db');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Order service is live on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}
bootstrap();
