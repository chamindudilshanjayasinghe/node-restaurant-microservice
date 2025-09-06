import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB(uri: string) {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    }).then((mongoose) => {
      console.log('✅ MongoDB connected');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
