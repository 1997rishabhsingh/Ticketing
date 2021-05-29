import { natsWrapper } from "./nats-wrapper";

const start = async () => {
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

    process.on("SIGTERM", () => natsWrapper.client.close());
    process.on("SIGINT", () => natsWrapper.client.close());
  } catch (err) {
    console.log(err);
  }
};

start();
