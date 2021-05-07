import request from "supertest";
import faker from "faker";

import { app } from "../../app";

it("return 201 on successful signup", async () => {
  const signupData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };
  return request(app).post("/api/users/signup").send(signupData).expect(201);
});

it("returns a 400 with an invalid email", async () => {
  const signupData = {
    email: "asdfg",
    password: faker.internet.password()
  };
  return request(app).post("/api/users/signup").send(signupData).expect(400);
});

it("returns a 400 with an invalid password", async () => {
  const signupData = {
    email: faker.internet.email(),
    password: "aq"
  };
  return request(app).post("/api/users/signup").send(signupData).expect(400);
});

it("returns a 400 with missing email and password", async () => {
  let signupData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  await request(app)
    .post("/api/users/signup")
    .send({
      email: faker.internet.email()
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: faker.internet.password()
    })
    .expect(400);
});

it("does not allow duplicate email", async () => {
  const signupData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  await request(app).post("/api/users/signup").send(signupData).expect(201);

  await request(app).post("/api/users/signup").send(signupData).expect(400);
});

it("sets a cookie after successful signup", async () => {
  const signupData = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  const response = await request(app)
    .post("/api/users/signup")
    .send(signupData)
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
