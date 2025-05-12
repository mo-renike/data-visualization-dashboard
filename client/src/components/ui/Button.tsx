import React, { useState, MouseEvent, ReactNode } from "react";

interface CustomButtonProps {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  variant?: "contained" | "outlined" | "text";
  icon?: ReactNode;
  endIcon?: ReactNode;
  route?: string;
  iconOnly?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export default function CustomButton({
  text,
  disabled = false,
  loading = false,
  loadingText,
  variant = "contained",
  icon,
  endIcon,
  route,
  iconOnly = false,
  onClick,
}: CustomButtonProps) {
  const [isHover, setIsHover] = useState(false);

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(event);
  };

  const getBackgroundColor = () => {
    if (disabled || loading) return "bg-blue-300 opacity-30";

    if (variant === "contained") {
      return isHover ? "bg-blue-700" : "bg-[#2563EB]";
    }

    if (variant === "outlined" && isHover) {
      return "bg-blue-600";
    }

    return "bg-transparent";
  };

  const getTextColor = () => {
    if (disabled || loading) return "text-blue-900 opacity-30";

    if (variant === "contained") {
      return "text-white";
    }

    return "text-black";
  };

  const getBorder = () => {
    if (variant === "outlined") {
      return "border border-[#EEEDF0]";
    }

    return "";
  };

  const getHoverStyles = () => {
    if (variant === "text") {
      return "hover:underline";
    }

    return "";
  };

  const commonClasses = `
        rounded-sm 
        px-4 py-2 
   w-full
         
        font-[16px]
        flex 
        items-center 
        justify-center
       
        font-inter
      
        ${getBackgroundColor()} 
        ${getTextColor()} 
        ${getBorder()} 
        ${getHoverStyles()}
        ${disabled || loading ? "cursor-not-allowed" : "cursor-pointer"}
    `;

  const renderContent = () => (
    <>
      {!iconOnly && icon && <span className="mr-2">{icon}</span>}

      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{loadingText ?? text}</span>
        </>
      ) : iconOnly ? (
        <span>{icon}</span>
      ) : (
        <>
          <span>{text}</span>
          {endIcon && <span className="ml-2">{endIcon}</span>}
        </>
      )}
    </>
  );

  if (route && !disabled && !loading) {
    return (
      <a
        href={route}
        className={commonClasses}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      onClick={handleButtonClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      disabled={disabled || loading}
      className={commonClasses}
    >
      {renderContent()}
    </button>
  );
}
