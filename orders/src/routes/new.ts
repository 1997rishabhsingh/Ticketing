import { Request, Response, NextFunction, Router } from "express";

const router = Router();

router.post("/api/orders", async (req: Request, res: Response) => {
  res.send({});
});

export { router as newOrderRouter };
