import React from "react";

// Table wrapper
export const Table = ({ children, className }) => (
  <div className={`overflow-x-auto ${className || ""}`}>
    <table className="w-full border-collapse">{children}</table>
  </div>
);

// Table header
export const TableHeader = ({ children }) => (
  <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children }) => (
  <tr className="border-b dark:border-gray-700 last:border-b-0">{children}</tr>
);

export const TableHead = ({ children }) => (
  <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-200">
    {children}
  </th>
);

export const TableCell = ({ children }) => (
  <td className="p-3 text-gray-700 dark:text-gray-200">{children}</td>
);
