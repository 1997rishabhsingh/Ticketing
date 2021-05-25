import { NotFoundError, OrderStatus, requireAuth } from "@rishtickets/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order";

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
    );

    if (!order) {
      throw new NotFoundError();
    }

    // publish event on cancellation

    res.status(200).send(order);
  }
);

export { router as updateOrderRouter };
