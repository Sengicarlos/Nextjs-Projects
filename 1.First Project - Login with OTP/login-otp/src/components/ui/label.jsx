import React from "react";

export function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`text-gray-700 font-medium ${className}`}>
      {children}
    </label>
  );
}
