import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  adminNav,
  customerNav,
  utilityItems,
} from "../../constants/Navigation";
import { Menu } from "lucide-react";

const Sidebar: React.FC = () => {
  const { auth, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = auth.user?.role === "admin";
  const navigationItems = isAdmin ? adminNav : customerNav;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[220px]"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 justify-between">
          {" "}
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center">
            <img src="/logo.png" className="w-[27px] h-[27px]" alt="XYZ shop" />
            {!collapsed && (
              <span className="font-bold text-[#0F172A] text-[23.3px] ml-2">
                XYZ shop
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={item.name}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                  isActive
                    ? "text-brand-blue bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className={`${collapsed ? "" : "mr-3"} h-5 w-5`} />
              {!collapsed && item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <nav className="space-y-1 px-3">
          {utilityItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={item.name === "Log Out" ? logout : undefined}
              title={item.name}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                  isActive
                    ? "text-brand-blue bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className={`${collapsed ? "" : "mr-3"} h-5 w-5`} />
              {!collapsed && item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
