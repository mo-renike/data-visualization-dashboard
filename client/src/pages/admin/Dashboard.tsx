import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { API_URL } from "../../../utils/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import OrderTable from "../../components/orders/OrderTable";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
  totalRevenue: number;
  orderCount: number;
  customerCount: number;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  ordersByCategory: {
    category: string;
    count: number;
  }[];
  recentOrders: Order[];
}

interface Order {
  id: string;
  productName: string;
  productCategory: string;
  price: number;
  orderDate: string;
  customerName: string;
}

type TimeFilter = "this_month" | "last_month" | "this_year" | "last_year";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("this_year");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_URL}/admin/dashboard?timeFilter=${timeFilter}`
        );
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilter]);

  // Format the current date
  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, dd MMMM yyyy");

  // Prepare chart data
  const revenueChartData = {
    labels: dashboardData?.revenueByMonth.map((item) => item.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: dashboardData?.revenueByMonth.map((item) => item.revenue) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: dashboardData?.ordersByCategory.map((item) => item.category) || [],
    datasets: [
      {
        label: "Orders by Category",
        data: dashboardData?.ordersByCategory.map((item) => item.count) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Admin</h1>
          <p className="text-gray-500">{formattedDate}</p>
        </div>

        <div className="mt-4 sm:mt-0">
          <div className="inline-flex items-center rounded-md border border-gray-200 bg-white">
            <button
              onClick={() => setTimeFilter("this_month")}
              className={`px-4 py-2 text-sm font-medium ${
                timeFilter === "this_month"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              } rounded-l-md`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFilter("last_month")}
              className={`px-4 py-2 text-sm font-medium ${
                timeFilter === "last_month"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              } border-l border-gray-200`}
            >
              Last Month
            </button>
            <button
              onClick={() => setTimeFilter("this_year")}
              className={`px-4 py-2 text-sm font-medium ${
                timeFilter === "this_year"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              } border-l border-gray-200`}
            >
              This Year
            </button>
            <button
              onClick={() => setTimeFilter("last_year")}
              className={`px-4 py-2 text-sm font-medium ${
                timeFilter === "last_year"
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              } rounded-r-md border-l border-gray-200`}
            >
              Last Year
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd>
                    <div className="text-xl font-semibold text-gray-900">
                      {formatCurrency(dashboardData?.totalRevenue || 0)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Order Count Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Orders
                  </dt>
                  <dd>
                    <div className="text-xl font-semibold text-gray-900">
                      {dashboardData?.orderCount || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Count Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Customers
                  </dt>
                  <dd>
                    <div className="text-xl font-semibold text-gray-900">
                      {dashboardData?.customerCount || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">
            Revenue over time
          </h3>
          <div className="h-64 mt-4">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">
            Orders by categories
          </h3>
          <div className="flex justify-center h-64 mt-4">
            <Pie
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Orders</h3>
        {dashboardData?.recentOrders &&
        dashboardData.recentOrders.length > 0 ? (
          <OrderTable orders={dashboardData.recentOrders} isAdmin={true} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">
              No orders found for the selected time period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
