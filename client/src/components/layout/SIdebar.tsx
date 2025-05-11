import React from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Settings,
  BarChartBig,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar: React.FC = () => {
  const { auth, logout } = useAuth();

  const isAdmin = auth.user?.role === "admin";

  return (
    <div className="w-[220px] bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-brand-blue flex items-center justify-center">
            <span className="text-white font-bold">XYZ</span>
          </div>
          <span className="font-bold text-gray-800">shop</span>
        </div>
      </div>

      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {isAdmin ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                    isActive
                      ? "text-brand-blue bg-blue-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <BarChartBig className="mr-3 h-5 w-5" />
                Overview
              </NavLink>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                    isActive
                      ? "text-brand-blue bg-blue-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5" />
                Customers
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                  isActive
                    ? "text-brand-blue bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <ShoppingCart className="mr-3 h-5 w-5" />
              My Orders
            </NavLink>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                isActive
                  ? "text-brand-blue bg-blue-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </NavLink>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log Out
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
