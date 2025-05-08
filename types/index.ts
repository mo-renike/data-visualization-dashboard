export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  productName: string;
  productCategory: string;
  price: number;
  orderDate: Date;
  createdAt: Date;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface DashboardStats {
  totalRevenue: number;
  orderCount: number;
  customerCount: number;
}

export interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}
