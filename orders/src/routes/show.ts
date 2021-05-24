import { NotFoundError, requireAuth } from "@rishtickets/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order";

const router = Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findOne({
      id: orderId,
      userId: req.currentUser!.id
    }).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
