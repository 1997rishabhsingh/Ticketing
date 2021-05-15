import request from "supertest";
import { app } from "../../app";

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

it("returns error if invalid title provided", async () => {});

it("returns error if invalid price provided", async () => {});

it("creates a ticket with valid inputs", async () => {});
