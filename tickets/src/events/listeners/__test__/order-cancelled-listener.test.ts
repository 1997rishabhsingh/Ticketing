import mongoose from "mongoose";
import faker from "faker";

import { OrderCancelledEvent } from "@rishtickets/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const randomOrderId = mongoose.Types.ObjectId().toHexString();

  // create and save ticket
  const ticket = Ticket.build({
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2)),
    userId: mongoose.Types.ObjectId().toHexString()
  });
  ticket.set({ orderId: randomOrderId });
  await ticket.save();

  // create data event
  const data: OrderCancelledEvent["data"] = {
    id: randomOrderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};

it("updates ticket by removing orderId", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("publishes an event and acknowledges message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // ts now treats publish as a jest mock function
  const ticketStr = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  const ticket = JSON.parse(ticketStr);

  expect(ticket.orderId).not.toBeDefined();

  expect(msg.ack).toHaveBeenCalled();
});
