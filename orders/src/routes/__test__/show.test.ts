import request from "supertest";
import faker from "faker";
import mongoose from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  const { cookie, id } = global.signin();
  const randomId = mongoose.Types.ObjectId().toHexString();

  // Create ticket
  const ticket = Ticket.build({
    id: randomId,
    title: faker.commerce.product(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2))
  });
  await ticket.save();

  // Create order with the ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // request to fetch order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(fetchedOrder).toEqual(order);
});

it("return error if user does not own order", async () => {
  const user1 = global.signin();
  const user2 = global.signin();
  const randomId = mongoose.Types.ObjectId().toHexString();

  // Create ticket
  const ticket = Ticket.build({
    id: randomId,
    title: faker.commerce.product(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2))
  });
  await ticket.save();

  // Create order with the ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1.cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // request to fetch order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user1.cookie)
    .send()
    .expect(200);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2.cookie)
    .send()
    .expect(404);
});
