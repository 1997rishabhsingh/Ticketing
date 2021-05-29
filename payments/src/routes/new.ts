import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from "@rishtickets/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Order } from "../models/orders";
import { stripe } from "../stripe";

const router = Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.currentUser!.id
    });

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order already cancelled");
    }

    await stripe.charges.create({
      currency: "inr",
      amount: order.price * 100,
      source: token
    });

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
