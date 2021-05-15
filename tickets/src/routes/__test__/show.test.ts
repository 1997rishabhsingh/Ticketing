import request from "supertest";
import faker from "faker";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns 404 if ticket not found", async () => {
  const { cookie } = global.signin();
  const randomId = new mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/tickets/${randomId}`)
    .set("Cookie", cookie)
    .send()
    .expect(404);
});

it("returns ticket if found", async () => {
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

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(ticketResponse.body.title).toEqual(newTicket.title);
  expect(ticketResponse.body.price).toEqual(newTicket.price);
});
