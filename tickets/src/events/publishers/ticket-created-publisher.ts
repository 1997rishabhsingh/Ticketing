import { Publisher, Subjects, TicketCreatedEvent } from "@rishtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
