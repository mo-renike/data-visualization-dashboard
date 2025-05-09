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
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/orders" replace />;
    }
  }

  const tabs = [
    { label: "Login", value: "login", content: <LoginForm /> },
    { label: "Register", value: "register", content: <RegisterForm /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-md bg-brand-blue flex items-center justify-center">
              <span className="text-white text-xl font-bold">XYZ</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account or create a new one
          </h2>
        </div>

        <CustomTabs tabs={tabs} defaultValue="login" />

        <div className="text-sm text-center mt-4">
          <p className="text-gray-600">Demo credentials:</p>
          <p className="text-gray-600 mt-1">
            Admin: admin@example.com / password
          </p>
          <p className="text-gray-600">
            Customer: customer@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
