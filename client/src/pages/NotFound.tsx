import React from "react";
import { Link } from "react-router-dom";
import CustomButton from "../components/ui/Button";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold mt-4 text-gray-600">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-500 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <CustomButton variant="contained" route="/" text="Go back home" />
    </div>
  );
};

export default NotFound;
