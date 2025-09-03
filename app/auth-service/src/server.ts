// src/server.ts
import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create the app
const app = express();

// Middleware
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", service: process.env.SERVICE_NAME || "unknown" });
});

// Example route (customize this per service)
app.get("/", (_req, res) => {
  res.send(`Welcome to ${process.env.SERVICE_NAME || "the service"}!`);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${process.env.SERVICE_NAME || "Service"} is running on port ${PORT}`);
});
