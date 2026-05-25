// src/components/filters/NGOFilterChips.jsx
import React from "react";

const FILTERS = [
  { label: "Food Donation", value: "food" },
  { label: "Child Welfare", value: "child" },
  { label: "Women Shelter", value: "women" },
  { label: "Education", value: "education" },
  { label: "Animal Rescue", value: "animal" },
  { label: "Medical Aid", value: "medical" },
];

export default function NGOFilterChips({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          className={`px-4 py-1 rounded-full border text-sm font-medium shadow-sm transition
            ${selected === filter.value
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"}
          `}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
