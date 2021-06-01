import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import faker from "faker";
import jwt from "jsonwebtoken";

if (!process.env.CI) {
  require("dotenv").config();
}

// Could also be done by making helper in separate file
declare global {
  namespace NodeJS {
    interface Global {
      signin(): {
        id: string;
        email: string;
        cookie: string[];
      };
    }
  }
}

jest.mock("../nats-wrapper");

let mongo: any;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: faker.internet.email()
  };

  const session = JSON.stringify({
    jwt: jwt.sign(payload, process.env.JWT_KEY!)
  });

  const base64 = Buffer.from(session).toString("base64");

  return {
    ...payload,
    cookie: [`express:sess=${base64}`]
  };
};
