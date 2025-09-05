import { Schema, model, Document } from "mongoose";

export interface OrderDocument extends Document {
  orderNo: string;
  items: {
    itemId: Schema.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    total: number;
    variations?: Record<string, any>; // e.g. size, toppings
  }[];
  status: "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  totalAmount: number;
  paidAmount: number;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    orderNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    items: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        total: { type: Number, required: true, min: 0 },
        variations: { type: Object }, // flexible JSON for customizations
      },
    ],
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "PREPARING", "READY", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    orderType: {
      type: String,
      enum: ["DINE_IN", "TAKEAWAY", "DELIVERY"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED"],
      default: "UNPAID",
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // 🔑 Audit fields
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<OrderDocument>("Order", OrderSchema);
