import { Router } from "express";

const router = Router();

router.post("/api/users/signin", (req, res) => {
  res.send("Sign In");
});

export { router as signinRouter };
