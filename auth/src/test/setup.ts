import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import faker from "faker";
import request from "supertest";

import { app } from "../app";

// Could also be done by making helper in separate file
declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<{ email: string; password: string; cookie: string[] }>;
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfe";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const signupData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  const response = await request(app)
    .post("/api/users/signup")
    .send(signupData)
    .expect(201);

  return {
    ...signupData,
    cookie: response.get("Set-Cookie")
  };
};
