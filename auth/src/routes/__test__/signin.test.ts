import request from "supertest";
import faker from "faker";

import { app } from "../../app";

it("fails when an email that does not exists is supplied", async () => {
  const loginData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  await request(app).post("/api/users/signin").send(loginData).expect(400);
});

it("fails when incorrect password is provided", async () => {
  const signupData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  await request(app).post("/api/users/signup").send(signupData).expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: signupData.email,
      password: "asdf"
    })
    .expect(400);
});

it("responds with cokkie when given valid credentials", async () => {
  const signupData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  await request(app).post("/api/users/signup").send(signupData).expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send(signupData)
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
