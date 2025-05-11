import { useState, useEffect } from "react";

import { format } from "date-fns";
import Header from "../../components/layout/Header";
import OrderTable from "../../components/orders/OrderTable";
import Sidebar from "../../components/layout/SIdebar";
import { TimeFilter } from "../../types";
import { fetchDashboardData } from "../../services/dashboardService";
import DateFilter from "../../components/ui/DateFIlter";
import StatCard from "../../components/ui/StatCard";
import CategoryChart from "../../components/dashboard/categoryChart";
import RevenueChart from "../../components/dashboard/revenueChart";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminDashboard() {
  const { auth } = useAuth();
  const user = auth.user;

  const [selectedDateFilter, setSelectedDateFilter] =
    useState<TimeFilter>("This Year");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      customerCount: 0,
      revenueGrowth: 0,
      orderGrowth: 0,
      customerGrowth: 0,
    },
    revenueChart: [],
    categoryChart: [],
    recentOrders: [],
  });

  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, dd MMMM yyyy");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardData(selectedDateFilter);

        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedDateFilter]);

  const revenueChartData = {
    labels: dashboardData.revenueChart.map((item: any) => {
      const [year, month] = item.month.split("-");
      const date = new Date(Number(year), Number(month) - 1);
      return date.toLocaleString("default", { month: "short" });
    }),
    values: dashboardData.revenueChart.map((item: any) => item.revenue / 1000),
  };

  const handleDateFilterChange = (filter: TimeFilter) => {
    setSelectedDateFilter(filter);
    setShowDateFilter(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome, {user?.name?.split(" ")[0]}
                </h1>
                <p className="text-gray-500">{formattedDate}</p>
              </div>
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 border rounded-md"
                  onClick={() => setShowDateFilter(!showDateFilter)}
                >
                  {selectedDateFilter}
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {showDateFilter && (
                  <div className="absolute right-0 top-full mt-1 z-50">
                    <DateFilter
                      onFilterChange={handleDateFilterChange}
                      defaultSelected={selectedDateFilter}
                    />
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value={dashboardData.stats.totalRevenue}
                percentChange={dashboardData.stats.revenueGrowth}
                prefix="$"
              />
              <StatCard
                title="Orders"
                value={dashboardData.stats.totalOrders}
                percentChange={dashboardData.stats.orderGrowth}
              />
              <StatCard
                title="Customers"
                value={dashboardData.stats.customerCount}
                percentChange={dashboardData.stats.customerGrowth}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Revenue over time</h3>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <RevenueChart data={revenueChartData} />
                )}
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">
                  Orders by categories
                </h3>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <CategoryChart
                    data={dashboardData.categoryChart}
                    total={dashboardData.stats.totalOrders}
                  />
                )}
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Orders</h3>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : dashboardData.recentOrders &&
                dashboardData.recentOrders.length > 0 ? (
                <OrderTable orders={dashboardData.recentOrders} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No orders found for the selected time period.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
