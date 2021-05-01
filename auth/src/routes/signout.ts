import { Router } from "express";

const router = Router();

router.post("/api/users/signout", (req, res) => {
  res.send("Sign Out");
});

export { router as signoutRouter };
