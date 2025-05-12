import { PrismaClient, Prisma } from "@prisma/client";
import { getDateFilter } from "../utils/dateFilter";

const prisma = new PrismaClient();

export const getStats = async (timeFilter: string) => {
  const dateFilter = getDateFilter(timeFilter);
  const whereClause = { orderDate: dateFilter };

  const [revenueResult, orderCount, uniqueCustomers] = await Promise.all([
    prisma.order.aggregate({
      where: whereClause,
      _sum: { price: true },
    }),
    prisma.order.count({ where: whereClause }),
    getUniqueCustomers(dateFilter),
  ]);

  const { revenueGrowth, orderGrowth } = await calculateGrowthMetrics(
    dateFilter,
    revenueResult._sum.price || 0,
    orderCount
  );

  return {
    totalRevenue: revenueResult._sum.price || 0,
    totalOrders: orderCount,
    customerCount: Number(uniqueCustomers[0].count),
    revenueGrowth,
    orderGrowth,
    customerGrowth: 0,
  };
};

const getUniqueCustomers = async (dateFilter: Prisma.DateTimeFilter) => {
  if (dateFilter.gte && dateFilter.lte) {
    return prisma.$queryRaw<{ count: BigInt }[]>`
      SELECT COUNT(DISTINCT "userId") as count FROM "Order" 
      WHERE "orderDate" >= ${dateFilter.gte} AND "orderDate" <= ${dateFilter.lte}
    `;
  }
  return prisma.$queryRaw<{ count: BigInt }[]>`
    SELECT COUNT(DISTINCT "userId") as count FROM "Order" 
    WHERE "orderDate" >= ${dateFilter.gte}
  `;
};

const calculateGrowthMetrics = async (
  dateFilter: Prisma.DateTimeFilter,
  currentRevenue: number,
  currentOrders: number
) => {
  const currentDate = new Date();
  const previousMonth = new Date(currentDate);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const [previousMonthRevenue, previousMonthOrderCount] = await Promise.all([
    prisma.order.aggregate({
      where: {
        orderDate: { gte: previousMonth, lt: currentDate },
      },
      _sum: { price: true },
    }),
    prisma.order.count({
      where: {
        orderDate: { gte: previousMonth, lt: currentDate },
      },
    }),
  ]);

  const revenueGrowth = previousMonthRevenue._sum.price
    ? ((currentRevenue - previousMonthRevenue._sum.price) /
        previousMonthRevenue._sum.price) *
      100
    : 0;

  const orderGrowth = previousMonthOrderCount
    ? ((currentOrders - previousMonthOrderCount) / previousMonthOrderCount) *
      100
    : 0;

  return { revenueGrowth, orderGrowth };
};
