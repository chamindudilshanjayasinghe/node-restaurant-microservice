import { Schema, model, Document } from "mongoose";

export interface ItemDocument extends Document {
  name: string;
  description?: string;
  price: number;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  images: {
    name: string;
    url: string;
    type: string;
  }[];
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<ItemDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DELETED"],
      default: "ACTIVE",
    },
    images: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: "ITEM_IMAGE" },
      },
    ],
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

// Avoid duplicate item names within the same branch
ItemSchema.index({ name: 1 }, { unique: true });

export const Item = model<ItemDocument>("Item", ItemSchema);
