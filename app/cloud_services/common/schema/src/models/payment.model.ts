import { Schema, model, Document } from "mongoose";

export type PaymentProvider = "STRIPE";
export type GatewayMode = "TEST" | "LIVE";

/** Normalize Stripe statuses into your app domain */
export type PaymentStatus =
  | "REQUIRES_PAYMENT_METHOD"
  | "REQUIRES_CONFIRMATION"
  | "REQUIRES_ACTION"
  | "PROCESSING"
  | "SUCCEEDED"
  | "CANCELED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface PaymentRecordDocument extends Document {
  provider: PaymentProvider;           // "STRIPE"
  mode: GatewayMode;                   // "TEST" | "LIVE"

  // Link back to your system
  orderId?: Schema.Types.ObjectId | string;
  customerId?: Schema.Types.ObjectId | string;

  // Stripe identifiers
  paymentIntentId?: string;            // pi_*
  chargeId?: string;                   // ch_*
  paymentMethodId?: string;            // pm_*
  customerExtId?: string;              // cus_*
  checkoutSessionId?: string;          // cs_*
  balanceTransactionId?: string;       // txn_*

  // Amounts are stored as integer minor units (e.g., cents/öre)
  amountTotal: number;                 // e.g., 1299 = 12.99
  amountCaptured?: number;             // captured amount (if capture separate)
  amountRefunded?: number;             // total refunded to date
  currency: string;                    // "SEK", "GBP", etc.

  status: PaymentStatus;
  description?: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;      // your app-level metadata (safe to store)

  // Idempotency + audit from webhook
  eventId: string;                     // Stripe event id (ev_*) — unique per event
  eventType: string;                   // "payment_intent.succeeded", etc.
  eventCreatedAt?: Date;               // Stripe event created timestamp
  signature?: string;                  // Stripe-Signature header (optional)
  rawEvent?: Record<string, any>;      // (optional) raw Stripe event payload (if you keep it)

  // Optional human audit (webhook usually has no user)
  createdBy?: Schema.Types.ObjectId | null;
  updatedBy?: Schema.Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

const PaymentRecordSchema = new Schema<PaymentRecordDocument>(
  {
    provider: { type: String, enum: ["STRIPE"], required: true },
    mode: { type: String, enum: ["TEST", "LIVE"], required: true },

    orderId: { type: Schema.Types.Mixed },
    customerId: { type: Schema.Types.Mixed },

    paymentIntentId: { type: String, index: true },
    chargeId: { type: String, index: true },
    paymentMethodId: { type: String },
    customerExtId: { type: String, index: true },
    checkoutSessionId: { type: String, index: true },
    balanceTransactionId: { type: String },

    amountTotal: { type: Number, required: true, min: 0 },
    amountCaptured: { type: Number, min: 0, default: 0 },
    amountRefunded: { type: Number, min: 0, default: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true },

    status: {
      type: String,
      enum: [
        "REQUIRES_PAYMENT_METHOD",
        "REQUIRES_CONFIRMATION",
        "REQUIRES_ACTION",
        "PROCESSING",
        "SUCCEEDED",
        "CANCELED",
        "FAILED",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
      ],
      required: true,
    },
    description: { type: String },
    receiptUrl: { type: String },
    metadata: { type: Object, default: {} },

    eventId: { type: String, required: true, unique: true }, // idempotency guard
    eventType: { type: String, required: true },
    eventCreatedAt: { type: Date },
    signature: { type: String },
    rawEvent: { type: Object },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const PaymentRecord = model<PaymentRecordDocument>("PaymentRecord", PaymentRecordSchema);
