import { Router, Request, Response } from "express";
import { body } from "express-validator";
import {
  NotFoundError,
  requireAuth,
  UnauthorizedError,
  validateRequest
} from "@rishtickets/common";

import { Ticket } from "../models/ticket";

const router = Router();

router.put(
  "/api/tickets/:ticketId",
  requireAuth,
  [body("title"), body("price")],
  async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
