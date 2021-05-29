import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects
} from "@rishtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-names";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Complete;
    await order.save();

    // NOTE: Since no update will be made after order is marked 'Complete'
    // no order updated event is published

    msg.ack();
  }
}
