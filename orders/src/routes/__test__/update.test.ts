import request from "supertest";
import faker from "faker";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order status cancelled", async () => {
  const { cookie } = global.signin();

  // create ticket
  const ticket = Ticket.build({
    title: faker.commerce.product(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2))
  });
  await ticket.save();

  // create order with the ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel order
  const { body: cancelledOrder } = await request(app)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  // expect
  const updatedOrder = await Order.findById(cancelledOrder.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a cancelled order event", async () => {
  const { cookie } = global.signin();

  // create ticket
  const ticket = Ticket.build({
    title: faker.commerce.product(),
    price: parseFloat(faker.commerce.price(undefined, undefined, 2))
  });
  await ticket.save();

  // create order with the ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel order
  await request(app)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(200);

  expect(natsWrapper);
});
