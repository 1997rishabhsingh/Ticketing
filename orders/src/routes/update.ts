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

    /**
     * NOTE: not using findOneAndUpdate because
     * OCC(via mongoose-update-if-current) only works
     * using .save() mehtod
     */
    const order = await Order.findOne({
      _id: orderId,
      userId: req.currentUser!.id
    }).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // publish event on cancellation
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    res.status(200).send(order);
  }
);

export { router as updateOrderRouter };
