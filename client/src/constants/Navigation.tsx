import {
  LayoutGrid,
  Package,
  Users,
  LineChart,
  Star,
  Settings,
  LogOut,
  ShoppingBag,
} from "lucide-react";

export const adminNav = [
  { name: "Overview", icon: LayoutGrid, path: "/admin" },
  { name: "Sales", icon: LineChart, path: "#" },
  { name: "Customers", icon: Users, path: "#" },
  { name: "Inventory", icon: Package, path: "#" },
  { name: "Profit/Loss", icon: Star, path: "#" },
];
export const customerNav = [
  { name: "My Orders", icon: ShoppingBag, path: "/customer" },
];

export const utilityItems = [
  { name: "Settings", icon: Settings, path: "#" },
  { name: "Log Out", icon: LogOut, path: "#" },
];
