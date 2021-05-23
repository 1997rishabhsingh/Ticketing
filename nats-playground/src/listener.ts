import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

import { TicketCreatedListener } from "./events/ticket-created-listener";

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

  new TicketCreatedListener(stan).listen();
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
