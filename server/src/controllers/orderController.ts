import { PrismaClient } from "@prisma/client";
import { getDateFilter } from "../utils/dateFilter";

const prisma = new PrismaClient();

export const getOrders = async (timeFilter: string) => {
  const dateFilter = getDateFilter(timeFilter);
  return prisma.order.findMany({
    where: { orderDate: dateFilter },
    orderBy: { orderDate: "desc" },
    include: { user: true },
  });
};
