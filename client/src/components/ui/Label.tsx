import React from "react";

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-[#777980]"
    >
      {children}
    </label>
  );
};

export default Label;
