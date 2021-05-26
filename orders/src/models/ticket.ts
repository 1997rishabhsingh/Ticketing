import { Document, model, Model, Schema, UpdateQuery } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDocument extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  version: number;
}

interface TicketModel extends Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
  findByEventAndUpdate(
    event: {
      id: string;
      version: number;
    },
    updates: UpdateQuery<TicketDocument>
  ): Promise<TicketDocument | null>;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // rename id -> _id
  const { id, ...rest } = attrs;
  return new Ticket({ _id: id, ...rest });
};

ticketSchema.statics.findByEventAndUpdate = (
  event: {
    id: string;
    version: number;
  },
  updates: UpdateQuery<TicketDocument>
) => {
  return Ticket.findOneAndUpdate(
    { _id: event.id, version: event.version - 1 },
    updates,
    { new: true }
  );
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
};

const Ticket = model<TicketDocument, TicketModel>("Ticket", ticketSchema);

export { Ticket };
