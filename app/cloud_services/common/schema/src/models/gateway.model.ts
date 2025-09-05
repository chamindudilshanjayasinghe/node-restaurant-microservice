import { Schema, model, Document } from "mongoose";

export interface PaymentGatewayConfigDocument extends Document {
  provider: "STRIPE" | "PAYHERE" | "ADYEN" | "BRAINTREE" | "MANUAL";
  mode: "TEST" | "LIVE";
  isEnabled: boolean;
  currency: string;
  country?: string;
  allowedMethods: string[];
  credentials: Record<string, any>;
  redirectUrls: {
    successUrl?: string;
    cancelUrl?: string;
    webhookUrl?: string;
  };
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentGatewayConfigSchema = new Schema<PaymentGatewayConfigDocument>(
  {
    provider: {
      type: String,
      enum: ["STRIPE", "PAYHERE", "ADYEN", "BRAINTREE", "MANUAL"],
      required: true,
    },
    mode: { type: String, enum: ["TEST", "LIVE"], required: true },
    isEnabled: { type: Boolean, default: false },

    currency: { type: String, required: true, uppercase: true, trim: true },
    country: { type: String, uppercase: true, trim: true },

    allowedMethods: {
      type: [String],
      default: ["CARD"],
    },

    credentials: {
      type: Object,
      default: {},
    },

    redirectUrls: {
      successUrl: { type: String },
      cancelUrl: { type: String },
      webhookUrl: { type: String },
    },

    // Audit fields
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

PaymentGatewayConfigSchema.index({ provider: 1, mode: 1 }, { unique: true });

export const PaymentGatewayConfig = model<PaymentGatewayConfigDocument>(
  "PaymentGatewayConfig",
  PaymentGatewayConfigSchema
);
