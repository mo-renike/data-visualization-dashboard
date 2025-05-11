import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import CustomTabs from "../components/ui/Tabs";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

const AuthPage: React.FC = () => {
  const { auth } = useAuth();

  if (auth.isAuthenticated) {
    if (auth.user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/customer" replace />;
    }
  }

  const tabs = [
    { label: "Login", value: "login", content: <LoginForm /> },
    { label: "Register", value: "register", content: <RegisterForm /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full ">
        <div className="mx-auto h-12 w-[100px] bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
          XYZ Shop
        </div>
        <CustomTabs tabs={tabs} defaultValue="login" />
      </div>
    </div>
  );
};

export default AuthPage;
