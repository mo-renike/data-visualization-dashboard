import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Bell } from "lucide-react";

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const { auth } = useAuth();
  const user = auth.user;

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div>
          {title && (
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          )}
          {children}
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Bell size={20} />
          </button>
          <div className="flex items-center h-8 w-8 space-x-2">
            {user?.name.substring(0, 2).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
