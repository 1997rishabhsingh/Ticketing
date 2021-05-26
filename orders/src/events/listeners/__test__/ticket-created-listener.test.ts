import faker from "faker";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@rishtickets/common";

import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2)),
    userId: new mongoose.Types.ObjectId().toHexString()
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // call onMessage with data and msg
  await listener.onMessage(data, msg);

  // ensure ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acknowledges the message", async () => {
  const { listener, data, msg } = await setup();

  // call onMessage with data and msg
  await listener.onMessage(data, msg);

  // ensure ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);

  // ensure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
