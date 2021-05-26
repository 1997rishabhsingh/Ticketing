import { Ticket } from "../ticket";
import faker from "faker";
import mongoose from "mongoose";

it("implements optimistic concurrency control", async () => {
  // Create instance of ticket
  const ticket = Ticket.build({
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  // save ticket to DB
  await ticket.save();

  // fetch ticket and mainatin two instances
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // modify and save first ticket instance
  firstInstance!.set({ price: 10 });
  await firstInstance!.save();

  // mofidy and save second ticket instance
  secondInstance!.set({ price: 10 });

  expect(secondInstance!.save()).rejects.toThrow();
});

it("increments version on multiple saves", async () => {
  // Create instance of ticket
  const ticket = Ticket.build({
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  // save ticket to DB
  await ticket.save();

  expect(ticket.version).toEqual(0);

  // save ticket again
  await ticket.save();

  expect(ticket.version).toEqual(1);

  // save ticket again
  await ticket.save();

  expect(ticket.version).toEqual(2);
});
