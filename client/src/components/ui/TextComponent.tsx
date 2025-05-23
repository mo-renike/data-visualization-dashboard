import React from "react";

interface TextComponentProps {
  text: string;
  smallTitleText?: boolean;
  bodyText?: boolean;
  subHeaderText?: boolean;
  color?: string;
  className?: string;
}

const TextComponent: React.FC<TextComponentProps> = ({
  text,
  smallTitleText = false,
  bodyText = false,
  subHeaderText = false,
  color,
  className = "",
}) => {
  const textColor = color
    ? `text-[${color}]`
    : subHeaderText
    ? "text-[#0F172A]"
    : "text-[#64748B]";

  const baseClasses = "font-inter leading-[175%]";

  let specificClasses = "";
  if (subHeaderText) {
    specificClasses = "text-[24px] font-bold";
  } else if (bodyText) {
    specificClasses = "text-[16px] font-normal";
  } else if (smallTitleText) {
    specificClasses = "text-[15px] font-bold";
  }

  const combinedClasses = `${baseClasses} ${specificClasses} ${textColor} ${className}`;

  if (subHeaderText) return <h3 className={combinedClasses}>{text}</h3>;

  return <p className={combinedClasses}>{text}</p>;
};

export default TextComponent;
