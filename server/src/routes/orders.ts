import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, authorize } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authMiddleware, authorize(["CUSTOMER"]), async (req, res) => {
  const { productName, category, price, orderDate } = req.body;
  const user = (req as any).user;

  const order = await prisma.order.create({
    data: {
      productName,
      category,
      price: parseFloat(price),
      orderDate: new Date(orderDate),
      customerId: user.id,
    },
  });

  res.status(201).json(order);
});

export default router;
