import { OrderCancelledEvent, OrderStatus } from "@rishtickets/common";
import faker from "faker";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCompletedListener } from "../order-completed-listener";

const setup = async () => {
  const listener = new OrderCompletedListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: parseFloat(faker.commerce.price(undefined, undefined, 2)),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString()
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { data, listener, msg };
};

it("updates order status to completed", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it("acknowledges the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
