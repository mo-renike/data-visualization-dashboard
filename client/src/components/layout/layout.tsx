import React from "react";
import Sidebar from "./SIdebar";
import { useAuth } from "../../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { auth } = useAuth();

  return (
    <div className="flex min-h-screen">
      {auth.isAuthenticated && <Sidebar />}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};

export default Layout;
