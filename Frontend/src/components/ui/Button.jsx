// components/ui/button.jsx
import React from "react";

export function Button({ children, className, type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
