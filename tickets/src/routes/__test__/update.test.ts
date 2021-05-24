import request from "supertest";
import faker from "faker";
import mongoose from "mongoose";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns 404 if ticket not found", async () => {
  const { cookie } = global.signin();
  const randomId = new mongoose.Types.ObjectId();

  const updates = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  await request(app)
    .get(`/api/tickets/${randomId}`)
    .set("Cookie", cookie)
    .send(updates)
    .expect(404);
});

it("returns 401 if user not logged in", async () => {
  const randomId = new mongoose.Types.ObjectId();

  const updates = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  await request(app).get(`/api/tickets/${randomId}`).send(updates).expect(401);
});

it("returns 401 if user does not owns the ticket", async () => {
  // create 2 users
  const { cookie: cookie1 } = global.signin(); // user 1
  const { cookie: cookie2 } = global.signin(); // user 2

  const newTicket = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  // User 1 creates a ticket (say A)
  const response1 = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie1)
    .send(newTicket)
    .expect(201);

  const updates = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  // User 2 tries to update it
  await request(app)
    .put(`/api/tickets/${response1.body.id}`)
    .set("Cookie", cookie2)
    .send(updates)
    .expect(401);

  // Check if ticket was not modified in db

  // Get ticket with ticket A's id
  const response2 = await request(app)
    .get(`/api/tickets/${response1.body.id}`)
    .set("Cookie", cookie1)
    .expect(200);

  expect(response1.body).toEqual(response2.body);
});

it("returns 400 if invalid title or price provided", async () => {
  const { cookie } = global.signin();

  const newTicket = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(newTicket)
    .expect(201);

  const updates = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      ...updates,
      title: ""
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      ...updates,
      price: -parseFloat(faker.finance.amount(undefined, undefined, 2))
    })
    .expect(400);
});

it("updates ticket if valid title and price provided", async () => {
  const { cookie } = global.signin();

  const newTicket = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(newTicket)
    .expect(201);

  const updates = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(updates)
    .expect(200);

  const updatedResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(updatedResponse.body.title).toEqual(updates.title);
  expect(updatedResponse.body.price).toEqual(updates.price);
});

it("publishes an event", async () => {
  const { cookie } = global.signin();

  const newTicket = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(newTicket)
    .expect(201);

  const updates = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(updates)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
