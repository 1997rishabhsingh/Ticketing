import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";

const app = express();

// middlewares
app.use(express.json());

// route handlers
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.listen(3000, () => {
  console.log("Auth service listening on 3000!");
});
