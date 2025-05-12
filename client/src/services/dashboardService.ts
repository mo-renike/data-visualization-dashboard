import axios from "axios";
import { API_URL } from "../utils/utils";
import { DashboardData, TimeFilter } from "../types";

export const fetchDashboardData = async (
  timeFilter: TimeFilter
): Promise<DashboardData> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const [stats, revenueChart, categoryChart, orders] = await Promise.all([
      axios.get(`${API_URL}/stats/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeFilter },
      }),
      axios.get(`${API_URL}/stats/revenue-chart`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeFilter },
      }),
      axios.get(`${API_URL}/stats/category-chart`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeFilter },
      }),
      axios.get(`${API_URL}/stats/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeFilter },
      }),
    ]);

    return {
      stats: stats.data,
      revenueChart: revenueChart.data,
      categoryChart: categoryChart.data,
      recentOrders: orders.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to load dashboard data");
  }
};

export const fetchCustomerOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw new Error("Failed to load customer orders");
  }
};

export const createOrder = async (orderData: any) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};
