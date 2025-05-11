export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  customerCount: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
}

export interface CategoryChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface Order {
  id: string;
  productName: string;
  productCategory: string;
  price: number;
  orderDate: string;
  userId: string;
  user?: User;
}

export type TimeFilter =
  | "This Month"
  | "Last Month"
  | "This Year"
  | "Last Year";

export interface DashboardData {
  stats: DashboardStats;
  revenueChart: RevenueChartData[];
  categoryChart: CategoryChartData[];
  recentOrders: Order[];
}
