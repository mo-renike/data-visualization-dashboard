import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  adminNav,
  customerNav,
  utilityItems,
} from "../../constants/Navigation";
import { Menu } from "lucide-react";
import Modal from "../common/Modal";

const Sidebar: React.FC = () => {
  const { auth, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const isAdmin = auth.user?.role === "admin";
  const navigationItems = isAdmin ? adminNav : customerNav;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsModalOpen(false);
    logout();
  };

  const SidebarLink = ({ item, isUtility = false }) => {
    const isActive = item.path !== "#" && location.pathname === item.path;

    return (
      <div
        key={item.name}
        className={`flex items-center py-3 text-base relative cursor-pointer ${
          isActive
            ? `text-blue-600 font-medium ${
                isUtility ? "border-l-2" : "border-l-4"
              } border-blue-600 pl-3 ${!isUtility ? "rounded-r-lg" : ""}`
            : "text-gray-500 hover:text-gray-700 pl-3.5"
        }`}
        onClick={item.name === "Log Out" ? handleLogoutClick : undefined}
        title={item.name}
      >
        {item.path !== "#" ? (
          <NavLink
            to={item.path}
            className="flex items-center w-full"
            style={{ color: "inherit" }}
          >
            <item.icon
              className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5`}
            />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ) : (
          <>
            <item.icon
              className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5`}
            />
            {!collapsed && <span>{item.name}</span>}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[240px]"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center">
            {!collapsed && (
              <>
                <img src="/logo.png" width={23} height={23} alt="XYZ" />{" "}
                <span className="font-semibold text-gray-900 text-xl ml-2">
                  XYZ shop
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarLink key={item.name} item={item} />
          ))}
        </nav>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-3">
          {utilityItems.map((item) => (
            <SidebarLink key={item.name} item={item} isUtility={true} />
          ))}
        </nav>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
      />
    </div>
  );
};

export default Sidebar;
