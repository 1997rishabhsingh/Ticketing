import mongoose from "mongoose";
import request from "supertest";
import faker from "faker";
import { app } from "../../app";
import { Order } from "../../models/orders";
import { OrderStatus } from "@rishtickets/common";

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
