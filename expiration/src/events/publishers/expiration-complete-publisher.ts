import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent
} from "@rishtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
