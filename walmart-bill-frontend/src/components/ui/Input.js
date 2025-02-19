import React from "react";

export function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      className="border border-gray-300 p-2 rounded w-full"
      {...props}
    />
  );
}
