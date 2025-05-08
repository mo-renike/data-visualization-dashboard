import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth";
import { Order } from "../../../types";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/dashboard", authMiddleware, async (req: any, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        price: true,
      },
    });

    const orderCount = await prisma.order.count();

    const customerCount = await prisma.user.count({
      where: {
        role: "customer",
      },
    });

    res.status(200).json({
      totalRevenue: totalRevenue._sum.price || 0,
      orderCount,
      customerCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/revenue", authenticateToken, async (req: any, res) => {
  try {
    const { role } = req.user;
    const { year } = req.query;

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const targetYear = year
      ? Number.parseInt(year as string)
      : new Date().getFullYear();

    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: new Date(`${targetYear}-01-01`),
          lt: new Date(`${targetYear + 1}-01-01`),
        },
      },
      select: {
        price: true,
        orderDate: true,
      },
    });

    const revenueByMonth = Array(12).fill(0);

    orders.forEach((order: Order) => {
      const month = order.orderDate.getMonth();
      revenueByMonth[month] += order.price;
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedRevenue = months.map((month, index) => ({
      month,
      revenue: revenueByMonth[index],
    }));

    res.status(200).json(formattedRevenue);
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/categories", authMiddleware, async (req: any, res) => {
  try {
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await prisma.order.findMany({
      select: {
        productCategory: true,
      },
    });

    const categoryCounts: Record<string, number> = {};

    orders.forEach((order: Order) => {
      const category = order.productCategory;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const totalOrders = orders.length;

    const categoryStats = Object.entries(categoryCounts).map(
      ([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalOrders) * 100),
      })
    );

    res.status(200).json(categoryStats);
  } catch (error) {
    console.error("Error fetching category stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
