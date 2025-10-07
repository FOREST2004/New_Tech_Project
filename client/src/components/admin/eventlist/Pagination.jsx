import React from "react";

const Pagination = ({ total, page, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-4 flex gap-2 items-center justify-center">
      {page > 1 && (
        <button
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 rounded-lg border bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:opacity-90 transition-colors"
        >
          Prev
        </button>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-lg border font-semibold transition-colors ${
            p === page
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white dark:from-blue-700 dark:to-indigo-700"
              : "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:opacity-90 text-gray-800 dark:text-gray-100"
          }`}
        >
          {p}
        </button>
      ))}

      {page < totalPages && (
        <button
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 rounded-lg border bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:opacity-90 transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
