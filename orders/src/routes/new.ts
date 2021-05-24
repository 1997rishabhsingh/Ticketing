import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@rishtickets/common";

const router = Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("Ticket Id is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
