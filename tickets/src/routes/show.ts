import { Router, Request, Response } from "express";
import { requireAuth, NotFoundError } from "@rishtickets/common";

import { Ticket } from "../models/ticket";

const router = Router();

router.get(
  "/api/tickets/:ticketId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
  }
);

export { router as showTicketRouter };
