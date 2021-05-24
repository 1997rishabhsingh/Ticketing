import request from "supertest";
import mongoose from "mongoose";
import faker from "faker";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("return error if ticket does not exists", async () => {
  const { cookie } = global.signin();
  const randomId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: randomId })
    .expect(404);
});

it("return error if ticket already reserved", async () => {
  const { cookie, id: userId } = global.signin();

  const ticket = Ticket.build({
    title: faker.commerce.product(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2))
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: userId.toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves ticket", async () => {
  const { cookie } = global.signin();

  const ticket = Ticket.build({
    title: faker.commerce.product(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2))
  });
  await ticket.save();

  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const savedOrder = await Order.findById(response.body.id);

  expect(savedOrder).toBeDefined();
});
