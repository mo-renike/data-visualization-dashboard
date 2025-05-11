import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, isAdmin, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user!;

      let orders;

      if (user.role === "ADMIN") {
        orders = await prisma.order.findMany({
          orderBy: { orderDate: "desc" },
        });
      } else {
        orders = await prisma.order.findMany({
          where: { userId: user.id },
          orderBy: { orderDate: "desc" },
        });
      }

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error getting orders:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { productName, productCategory, price, orderDate } = req.body;
      const user = req.user!;

      // Get user details for customer name
      const userDetails = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!userDetails) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const newOrder = await prisma.order.create({
        data: {
          productName,
          productCategory,
          price,
          orderDate: new Date(orderDate),
          userId: user.id,
        },
      });

      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = req.user!;

      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      // Check if the user is authorized to view this order
      if (user.role !== "ADMIN" && order.userId !== user.id) {
        res.status(403).json({ message: "Not authorized to view this order" });
        return;
      }

      res.status(200).json(order);
    } catch (error) {
      console.error("Error getting order:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { productName, productCategory, price, orderDate } = req.body;

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          productName,
          productCategory,
          price,
          orderDate: new Date(orderDate),
        },
      });

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete an order - Admin only
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await prisma.order.delete({
        where: { id },
      });

      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
