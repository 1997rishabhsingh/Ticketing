import mongoose from "mongoose";

import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Environment Variable 'JWT_KEY' not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Environment Variable 'MONGO_URI' not defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("Environment Variable 'NATS_CLIENT_ID' not defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("Environment Variable 'NATS_URL' not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("Environment Variable 'NATS_CLUSTER_ID' not defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    process.on("SIGTERM", () => natsWrapper.client.close());
    process.on("SIGINT", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Tickets service listening on 3000!");
  });
};

start();
