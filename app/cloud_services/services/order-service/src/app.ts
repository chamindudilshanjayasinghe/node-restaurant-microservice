import "reflect-metadata";
import express, { Request, Response } from 'express';
import { connectDB } from 'mongoose-client';
import dotenv from 'dotenv';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app = express(); // ✅ now express is defined
app.use(express.json());

app.use("/api/orders", orderRoutes);

async function bootstrap() {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/rms-order-db');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Order service is live on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
