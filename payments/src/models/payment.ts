import { OrderStatus } from "@rishtickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Document, Model, model, Schema } from "mongoose";

// Since no update will be done in payment hence no versioning here

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDocument extends Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends Model<PaymentDocument> {
  build(attrs: PaymentAttrs): PaymentDocument;
}

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true
    },
    stripeId: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      versionKey: false, // not include __v (could also be done via delete ret.__v)
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;

        return ret;
      }
    }
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = model<PaymentDocument, PaymentModel>("Payment", paymentSchema);

export { Payment };
