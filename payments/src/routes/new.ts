import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from "@rishtickets/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/orders";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
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

    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("Payment already completed");
    }

    const charge = await stripe.charges.create({
      currency: "inr",
      amount: order.price * 100,
      source: token
    });

    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
