import { Router, Request, Response } from "express";
import { requireAuth } from "@rishtickets/common";

const router = Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
