import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@rishtickets/common";
import { Ticket } from "../models/ticket";

const router = Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.status(200).send(tickets);
});

export { router as indexTicketRouter };
