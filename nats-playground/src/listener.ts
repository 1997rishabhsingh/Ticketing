import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222"
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    "ticket:created",
    "listenerQueueGroup1",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
    msg.ack();
  });
});

// Won't neccessarily be triggered since it might vary with platform
process.on("SIGINT", () => {
  console.log("SIGINT");
  stan.close();
});
process.on("SIGTERM", () => {
  console.log("SIGTERM");
  stan.close();
});
process.on("SIGKILL", () => {
  console.log("SIGKILL");
  stan.close();
});
