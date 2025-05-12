import { PrismaClient, Prisma } from "@prisma/client";
import { getDateFilter } from "../utils/dateFilter";

const prisma = new PrismaClient();

export const getRevenueChartData = async (timeFilter: string) => {
  const dateFilter = getDateFilter(timeFilter);

  if (dateFilter.gte && dateFilter.lte) {
    return prisma.$queryRaw<{ month: string; revenue: number }[]>`
      SELECT 
        to_char("orderDate", 'YYYY-MM') as month,
        SUM(price) as revenue
      FROM "Order"
      WHERE "orderDate" >= ${dateFilter.gte} AND "orderDate" <= ${dateFilter.lte}
      GROUP BY month
      ORDER BY month
    `;
  }
  return prisma.$queryRaw<{ month: string; revenue: number }[]>`
    SELECT 
      to_char("orderDate", 'YYYY-MM') as month,
      SUM(price) as revenue
    FROM "Order"
    WHERE "orderDate" >= ${dateFilter.gte}
    GROUP BY month
    ORDER BY month
  `;
};

export const getCategoryChartData = async (timeFilter: string) => {
  const dateFilter = getDateFilter(timeFilter);
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  const [categoryCounts, totalOrders] = await Promise.all([
    dateFilter.gte && dateFilter.lte
      ? prisma.$queryRaw<{ name: string; value: number }[]>`
          SELECT "productCategory" as name, COUNT(*) as value
          FROM "Order"
          WHERE "orderDate" >= ${dateFilter.gte} AND "orderDate" <= ${dateFilter.lte}
          GROUP BY "productCategory"
        `
      : prisma.$queryRaw<{ name: string; value: number }[]>`
          SELECT "productCategory" as name, COUNT(*) as value
          FROM "Order"
          WHERE "orderDate" >= ${dateFilter.gte}
          GROUP BY "productCategory"
        `,
    prisma.order.count({ where: { orderDate: dateFilter } }),
  ]);

  return categoryCounts.map((category, index) => ({
    ...category,
    value: Number(category.value),
    percentage: Math.round((Number(category.value) / totalOrders) * 100),
    color: colors[index % colors.length],
  }));
};
