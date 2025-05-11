import React from "react";
import { Field, ErrorMessage } from "formik";

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  className?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  errors?: any;
  touched?: any;
  children?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  placeholder,
  autoComplete,
  className,
  showPasswordToggle,
  showPassword,
  togglePasswordVisibility,
  errors,
  touched,
  children,
}) => {
  return (
    <div className="relative">
      {type === "select" ? (
        <div className="relative">
          <Field
            as="select"
            id={id}
            name={name}
            className={`appearance-none relative block w-full px-3 py-2 border border-[#E0E2E7] rounded-lg my-4 bg-[#F9F9FC] ${
              errors && touched ? "border-red-300" : "border-gray-300"
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${className}`}
          >
            {children}
          </Field>

          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 320 512"
              fill="currentColor"
            >
              <path d="M31.5 192h257c17.8 0 26.7 21.5 14.1 34.1l-128.5 128c-7.8 7.8-20.5 7.8-28.3 0l-128.5-128C4.8 213.5 13.7 192 31.5 192z" />
            </svg>
          </div>
        </div>
      ) : (
        <Field
          id={id}
          name={name}
          type={showPasswordToggle && showPassword ? "text" : type}
          autoComplete={autoComplete}
          className={`appearance-none relative block w-full px-3 py-2 border border-[#E0E2E7] rounded-lg my-4 bg-[#F9F9FC] ${
            errors && touched ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${className}`}
          placeholder={placeholder}
        />
      )}
      {showPasswordToggle && togglePasswordVisibility && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
      <ErrorMessage
        name={name}
        component="p"
        className="mt-1 text-xs text-red-600"
      />
    </div>
  );
};

export default InputField;
