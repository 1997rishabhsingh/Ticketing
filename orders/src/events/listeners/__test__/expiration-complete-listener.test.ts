import { ExpirationCompleteEvent } from "@rishtickets/common";
import faker from "faker";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2))
  });
  await ticket.save();

  // create and save order
  const order = Order.build({
    ticket,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
};

it("updates order status to Cancelled", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.orderId);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Emits Order Cancelled event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const orderStr = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  const order = JSON.parse(orderStr);

  expect(order.id).toEqual(data.orderId);
});

it("Acknowledges the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
