// src/components/ui/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500 opacity-70"></div>
    </div>
  );
}
