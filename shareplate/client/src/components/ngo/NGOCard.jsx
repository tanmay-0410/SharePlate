// src/components/ngo/NGOCard.jsx
import React from "react";
import { getDisplayName, getAddress, normalizeWebsite } from "../../lib/ngoUtils";

export default function NGOCard({ ngo, distance, onSelect, selected }) {
  const name = getDisplayName(ngo) || "Unnamed NGO";
  const address = getAddress(ngo.tags) || "Address unavailable";
  const website = normalizeWebsite(ngo.tags?.website || ngo.tags?.url);

  return (
    <div
      className={`bg-white/70 backdrop-blur shadow-lg rounded-xl p-5 mb-4 transition border hover:shadow-xl hover:-translate-y-1 ${
        selected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <div className="font-bold text-lg text-gray-800 mb-1 flex items-center gap-2">
            {name}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 underline text-sm"
              >
                Website
              </a>
            )}
          </div>
          <div className="text-gray-600 text-sm mb-1">{address}</div>
          <div className="text-xs text-gray-500 mb-1">
            {ngo.tags?.['office'] || ngo.tags?.['amenity'] || "NGO"}
          </div>
          <div className="text-xs text-gray-500">
            {distance !== undefined && <span>{(distance / 1000).toFixed(2)} km away</span>}
          </div>
        </div>
        <button
          className={`px-4 py-2 rounded-lg font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 transition ${
            selected ? "ring-2 ring-blue-400" : ""
          }`}
          onClick={() => onSelect(ngo)}
        >
          {selected ? "Selected" : "Select NGO"}
        </button>
      </div>
    </div>
  );
}
