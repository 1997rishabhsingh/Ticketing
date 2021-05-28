import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@rishtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find ticket to be reserved
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // Mark ticket unreserved by setting orderId to null and save
    // marking it 'undefined' as opposed to 'null' since optional value in TS
    // don't work very well with null
    ticket.set({ orderId: undefined });
    await ticket.save();

    // publish event to keep db in orders service and tickets service in sync
    // NOTE: don't need to import natsWrapper for the client!
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version
    });

    // ack the message
    msg.ack();
  }
}
