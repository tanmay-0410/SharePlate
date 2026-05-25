// src/components/ui/ErrorState.jsx
import React from "react";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="text-4xl mb-2">😕</div>
      <div className="text-lg font-semibold mb-2">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
