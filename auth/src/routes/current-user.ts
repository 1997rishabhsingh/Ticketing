import { Router } from "express";

const router = Router();

router.get("/api/users/currentuser", (req, res) => {
  res.send("Current User");
});

export { router as currentUserRouter };
