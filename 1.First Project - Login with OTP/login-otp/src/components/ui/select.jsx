"use client";

import * as React from "react";

export function Select({ children, value, onValueChange, className }) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`border rounded-md p-2 bg-white text-gray-900 ${className || ""}`}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return (
    <option value={value}>
      {children}
    </option>
  );
}

// Remove SelectTrigger, SelectValue, and SelectContent
// These were the source of <div> inside <select> errors
