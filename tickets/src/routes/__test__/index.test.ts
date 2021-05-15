import request from "supertest";
import faker from "faker";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = async () => {
  const { cookie } = global.signin();

  const newTicket = {
    title: faker.commerce.product(),
    price: parseFloat(faker.finance.amount(undefined, undefined, 2))
  };

  await request(app).post("/api/tickets").set("Cookie", cookie).send(newTicket);
};

it("return list of all tickets", async () => {
  // create 4 tickets
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(4);
});
