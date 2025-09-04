import express, { Request, Response } from 'express';
import { connectDB } from 'mongoose-client';
import dotenv from 'dotenv';

dotenv.config();

const app = express(); // ✅ now express is defined
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('🍔 Order Service is running');
});

async function bootstrap() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Order service is live on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
