import { Publisher, OrderCompletedEvent, Subjects } from "@rishtickets/common";

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
}
