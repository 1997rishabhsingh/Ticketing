import { Schema, model, Model, Document } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// interface to define structure to create new User

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface TicketModel extends Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      default: null
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
  return new Ticket(attrs);
};

const Ticket = model<TicketDocument, TicketModel>("Ticket", ticketSchema);

export { Ticket };
