import mongoose from "mongoose";
import request from "supertest";
import faker from "faker";
import { app } from "../../app";
import { Order } from "../../models/orders";
import { OrderStatus } from "@rishtickets/common";
import { stripe } from "../../stripe";

// jest.mock("../../stripe");

it("return 404 when order does not exist", async () => {
  const { cookie } = global.signin();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: faker.random.alphaNumeric(),
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it("returns 404 if order does not belongs to a user", async () => {
  const user1 = global.signin();
  const user2 = global.signin();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: user1.id,
    price: parseFloat(faker.commerce.price(undefined, undefined, 2)),
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", user2.cookie)
    .send({
      token: faker.random.alphaNumeric(),
      orderId: order.id
    })
    .expect(404);
});

it("return 400 when purchasing cancelled order", async () => {
  const { id: userId, cookie } = global.signin();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price: parseFloat(faker.commerce.price(undefined, undefined, 2)),
    status: OrderStatus.Cancelled
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: faker.random.alphaNumeric(),
      orderId: order.id
    })
    .expect(400);
});

it("return a 201 with valid inputs", async () => {
  const { id: userId, cookie } = global.signin();
  const price = parseFloat(faker.commerce.price(undefined, undefined, 2));
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId,
    price,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: process.env.STRIPE_TOKEN,
      orderId: order.id
    })
    .expect(201);

  const { data: charges } = await stripe.charges.list({
    limit: 50
  });

  // CASE 1: using real stripe API
  const charge = charges.find((c) => c.amount === price * 100);

  expect(charge).toBeDefined();

  expect(charge!.currency).toEqual("inr");

  // CASE 2: using mock function (need to remove .old from stripe mock file)
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions).toEqual({
  //   source: process.env.STRIPE_TOKEN,
  //   amount: order.price * 100,
  //   currency: "inr"
  // });
});
