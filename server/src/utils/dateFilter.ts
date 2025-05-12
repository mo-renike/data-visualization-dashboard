export const getDateFilter = (timeFilter: string = "This Year") => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(now.getFullYear(), 0, 0);

  switch (timeFilter) {
    case "This Month":
      return {
        gte: startOfMonth,
      };
    case "Last Month":
      return {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      };
    case "This Year":
      return {
        gte: startOfYear,
      };
    case "Last Year":
      return {
        gte: startOfLastYear,
        lte: endOfLastYear,
      };
    default:
      return {
        gte: startOfYear,
      };
  }
};
