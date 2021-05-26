import { Listener, Subjects, TicketUpdatedEvent } from "@rishtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-names";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findOneAndUpdate(
      {
        _id: id,
        version: version - 1
      },
      { title, price },
      { useFindAndModify: false, new: true }
    );

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    msg.ack();
  }
}
