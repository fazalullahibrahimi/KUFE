// src/components/Button.jsx
import React from "react";

const Button = ({ label, onClick, variant = "primary", disabled }) => {
  const baseStyle =
    "px-4 py-2 rounded-lg transition duration-200 font-semibold";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${styles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
};

export default Button;
