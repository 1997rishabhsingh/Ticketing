import request from "supertest";

import { app } from "../../app";

it("responds with current user details", async () => {
  const { email, cookie } = await global.signin();

  const { body } = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(email).toEqual(body.currentUser.email);
});

it("responds with null if not authenticated", async () => {
  const { body } = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(body.currentUser).toEqual(null);
});
