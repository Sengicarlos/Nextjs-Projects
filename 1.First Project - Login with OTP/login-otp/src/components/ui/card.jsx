import React from "react";

// Main Card container
export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 flex flex-col ${className}`}
    >
      {children}
    </div>
  );
}

// Card header
export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

// Card title
export function CardTitle({ children, className = "" }) {
  return <h2 className={`text-2xl font-bold text-gray-900 ${className}`}>{children}</h2>;
}

// Card description
export function CardDescription({ children, className = "" }) {
  return <p className={`text-gray-600 text-sm ${className}`}>{children}</p>;
}

// Card content
export function CardContent({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

// Card footer
export function CardFooter({ children, className = "" }) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}

// Card action (for buttons/links)
export function CardAction({ children, className = "" }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
