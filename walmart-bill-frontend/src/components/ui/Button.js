import React from "react";

export function Button({ children, onClick, variant = "default", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        variant === "default" ? "bg-blue-500 text-white" : "border border-gray-400"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
