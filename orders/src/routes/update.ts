import { NotFoundError, OrderStatus, requireAuth } from "@rishtickets/common";
import { Request, Response, Router } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.put(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        userId: req.currentUser!.id
      },
      {
        status: OrderStatus.Cancelled
      }
    ).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    // publish event on cancellation
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      }
    });

    res.status(200).send(order);
  }
);

export { router as updateOrderRouter };
