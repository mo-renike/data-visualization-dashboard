import { Router } from "express";
import { authMiddleware, isAdmin } from "../middleware/auth";
import { getStats } from "../controllers/statsController";
import {
  getRevenueChartData,
  getCategoryChartData,
} from "../controllers/chartController";
import { getOrders } from "../controllers/orderController";

const router = Router();

router.get("/stats", authMiddleware, isAdmin, async (req, res) => {
  try {
    const timeFilter = (req.query.timeFilter as string) || "This Year";
    const stats = await getStats(timeFilter);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/revenue-chart", authMiddleware, isAdmin, async (req, res) => {
  try {
    const timeFilter = (req.query.timeFilter as string) || "This Year";
    const result = await getRevenueChartData(timeFilter);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting revenue chart data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/category-chart", authMiddleware, isAdmin, async (req, res) => {
  try {
    const timeFilter = (req.query.timeFilter as string) || "This Year";
    const result = await getCategoryChartData(timeFilter);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting category chart data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/orders", authMiddleware, isAdmin, async (req, res) => {
  try {
    const timeFilter = (req.query.timeFilter as string) || "This Year";
    const orders = await getOrders(timeFilter);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting filtered orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
