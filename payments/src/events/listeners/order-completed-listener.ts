import {
  Listener,
  OrderCompletedEvent,
  OrderStatus,
  Subjects
} from "@rishtickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { queueGroupName } from "./queue-group-name";

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCompletedEvent["data"], msg: Message) {
    const order = await Order.findByEvent({
      id: data.id,
      version: data.version
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Complete;
    await order.save();

    msg.ack();
  }
}
