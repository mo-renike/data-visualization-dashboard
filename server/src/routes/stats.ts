import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, isAdmin } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/stats", authMiddleware, isAdmin, async (req, res) => {
  try {
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        price: true,
      },
    });

    const orderCount = await prisma.order.count();

    const uniqueCustomers = await prisma.$queryRaw<{ count: BigInt }[]>`
      SELECT COUNT(DISTINCT "userId") as count FROM "Order"
    `;

    const currentDate = new Date();
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const previousMonthRevenue = await prisma.order.aggregate({
      where: {
        orderDate: {
          gte: previousMonth,
          lt: currentDate,
        },
      },
      _sum: {
        price: true,
      },
    });

    const previousMonthOrderCount = await prisma.order.count({
      where: {
        orderDate: {
          gte: previousMonth,
          lt: currentDate,
        },
      },
    });

    const revenueGrowth = previousMonthRevenue._sum.price
      ? ((revenueResult._sum.price! - previousMonthRevenue._sum.price!) /
          previousMonthRevenue._sum.price!) *
        100
      : 0;

    const orderGrowth = previousMonthOrderCount
      ? ((orderCount - previousMonthOrderCount) / previousMonthOrderCount) * 100
      : 0;

    res.status(200).json({
      totalRevenue: revenueResult._sum.price || 0,
      totalOrders: orderCount,
      customerCount: Number(uniqueCustomers[0].count),
      revenueGrowth,
      orderGrowth,
      customerGrowth: 0,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/revenue-chart", authMiddleware, isAdmin, async (req, res) => {
  try {
    const result = await prisma.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT 
        to_char("orderDate", 'YYYY-MM') as month,
        SUM(price) as revenue
      FROM "Order"
      WHERE "orderDate" >= NOW() - INTERVAL '1 year'
      GROUP BY month
      ORDER BY month
    `;

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting revenue chart data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/category-chart", authMiddleware, isAdmin, async (req, res) => {
  try {
    const categoryCounts = await prisma.$queryRaw<
      { name: string; value: number }[]
    >`
      SELECT 
        "productCategory" as name,
        COUNT(*) as value
      FROM "Order"
      GROUP BY "productCategory"
    `;

    const totalOrders = await prisma.order.count();

    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];

    const result = categoryCounts.map((category: any, index: any) => ({
      ...category,
      value: Number(category.value),
      percentage: Math.round((Number(category.value) / totalOrders) * 100),
      color: colors[index % colors.length],
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting category chart data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/orders", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { timeFilter } = req.query;
    let dateFilter: any = {};

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(now.getFullYear(), 0, 0);

    switch (timeFilter) {
      case "This Month":
        dateFilter = {
          gte: startOfMonth,
        };
        break;
      case "Last Month":
        dateFilter = {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        };
        break;
      case "This Year":
        dateFilter = {
          gte: startOfYear,
        };
        break;
      case "Last Year":
        dateFilter = {
          gte: startOfLastYear,
          lte: endOfLastYear,
        };
        break;
      default:
        break;
    }

    const orders = await prisma.order.findMany({
      where: {
        orderDate: dateFilter,
      },
      orderBy: {
        orderDate: "desc",
      },
      include: {
        user: true,
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting filtered orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
