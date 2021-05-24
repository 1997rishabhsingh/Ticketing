import { Publisher, Subjects, TicketUpdatedEvent } from "@rishtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
