// src/components/ui/SkeletonLoader.jsx
import React from "react";

export default function SkeletonLoader({ className = "", count = 1, height = "h-24" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg mb-4 ${height}`}
        />
      ))}
    </div>
  );
}
