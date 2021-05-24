import request from "supertest";
import mongoose from "mongoose";
import faker from "faker";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: faker.commerce.product(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2))
  });
  await ticket.save();

  return ticket;
};

it("return all the orders for a particualar user", async () => {
  const user1 = global.signin(); // user 1
  const user2 = global.signin(); // user 2

  // Create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  // User 1 creates one order
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1.cookie)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // User 2 creates two orders
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2.cookie)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order3 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2.cookie)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Get all orders of user 1
  const { body: orsersUser1 } = await request(app)
    .get("/api/orders")
    .set("Cookie", user1.cookie);
  expect(orsersUser1.length).toEqual(1);
  expect(orsersUser1[0]).toEqual(order1);

  // Get all orders of user 2
  const { body: ordersUser2 } = await request(app)
    .get("/api/orders")
    .set("Cookie", user2.cookie);
  expect(ordersUser2.length).toEqual(2);
  expect(ordersUser2[0]).toEqual(order2);
  expect(ordersUser2[1]).toEqual(order3);
});
