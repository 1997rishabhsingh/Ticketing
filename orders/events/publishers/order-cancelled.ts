import { Publisher, OrderCancelledEvent, Subjects } from "@rishtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
