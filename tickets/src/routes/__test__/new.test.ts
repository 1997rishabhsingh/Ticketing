import request from "supertest";
import faker from "faker";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a POST route /api/tickets", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed by logged in user", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a ststus other than 401 for logged in user", async () => {
  const { cookie } = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns error if invalid title provided", async () => {
  const { cookie } = global.signin();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: faker.commerce.price()
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: faker.commerce.price()
    })
    .expect(400);
});

it("returns error if invalid price provided", async () => {
  const { cookie } = global.signin();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: faker.commerce.product(),
      price: -faker.commerce.price()
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: faker.commerce.product()
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const { cookie } = global.signin();

  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const newTicket = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(newTicket)
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(newTicket.title);
  expect(tickets[0].price).toEqual(newTicket.price);
});
