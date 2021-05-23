import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Environment Variable 'JWT_KEY' not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("Environment Variable 'MONGO_URI' not defined");
  }

  try {
    await natsWrapper.connect("ticketing", "dgdsfvfds", "http://nats-srv:4222");

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
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
