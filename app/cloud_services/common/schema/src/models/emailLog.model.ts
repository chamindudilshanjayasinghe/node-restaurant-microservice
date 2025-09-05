import { Schema, model, Document } from "mongoose";

export type EmailStatus = "SUCCESS" | "FAILED";

export interface PaymentEmailLogDocument extends Document {
  paymentId: Schema.Types.ObjectId; // reference PaymentRecord
  provider: "STRIPE" | "PAYHERE" | "ADYEN" | "BRAINTREE" | "MANUAL";
  mode: "TEST" | "LIVE";

  to: string;
  subject: string;
  templateName?: string;
  payload?: Record<string, any>; // data used for the template

  status: EmailStatus;
  errorMessage?: string;

  createdBy?: Schema.Types.ObjectId | null; // usually system user / null
  createdAt: Date;
}

const PaymentEmailLogSchema = new Schema<PaymentEmailLogDocument>(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: "PaymentRecord", required: true },
    provider: {
      type: String,
      enum: ["STRIPE", "PAYHERE", "ADYEN", "BRAINTREE", "MANUAL"],
      required: true,
    },
    mode: { type: String, enum: ["TEST", "LIVE"], required: true },

    to: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    templateName: { type: String },
    payload: { type: Object, default: {} },

    status: { type: String, enum: ["SUCCESS", "FAILED"], required: true },
    errorMessage: { type: String },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only need createdAt
  }
);

PaymentEmailLogSchema.index({ paymentId: 1, status: 1, createdAt: -1 });

export const PaymentEmailLog = model<PaymentEmailLogDocument>(
  "PaymentEmailLog",
  PaymentEmailLogSchema
);
