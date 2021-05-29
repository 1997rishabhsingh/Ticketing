import { OrderStatus } from "@rishtickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Document, Model, model, Schema } from "mongoose";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDocument extends Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends Model<OrderDocument> {
  build(attrs: OrderAttrs): OrderDocument;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus)
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

orderSchema.set("versionKey", "vsersion");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  });
};

const Order = model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
