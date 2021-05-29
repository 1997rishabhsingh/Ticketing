import { OrderCreatedEvent, OrderStatus } from "@rishtickets/common";
import faker from "faker";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: parseFloat(faker.commerce.price(undefined, undefined, 2))
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { data, listener, msg };
};

it("replicates order from event data", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("acknowledges the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
