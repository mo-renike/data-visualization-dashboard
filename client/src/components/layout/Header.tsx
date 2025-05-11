import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { BellDot, ChevronDown } from "lucide-react";

const Header = () => {
  const { auth } = useAuth();
  const user = auth.user;

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center ml-auto space-x-2">
          <button className="text-gray-500 hover:text-gray-700">
            <BellDot size={20} />
          </button>
          <div className="flex p-2 items-center justify-center h-8 w-8 rounded-full bg-gray-200">
            <p> {user?.name.substring(0, 2).toUpperCase() || "U"}</p>
          </div>
          <ChevronDown size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;
