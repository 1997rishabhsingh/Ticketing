import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@rishtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find ticket to be reserved
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // Mark ticket reserved by setting orderId and save
    ticket.set({ orderId: data.id });
    await ticket.save();

    // publish event to keep db in orders service and tickets service in sync
    // NOTE: don't need to import natsWrapper for the client!
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });

    // ack the message
    msg.ack();
  }
}
