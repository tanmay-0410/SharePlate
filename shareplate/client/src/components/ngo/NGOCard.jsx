// src/components/ngo/NGOCard.jsx
import React from "react";
import { getDisplayName, getAddress, normalizeWebsite } from "../../lib/ngoUtils";
import GlassPanel from "../ui/GlassPanel";
import Button from "../ui/Button";
import { motion } from "framer-motion";

export default function NGOCard({ ngo, distance, onSelect, selected }) {
  const name = getDisplayName(ngo) || "Unnamed NGO";
  const address = getAddress(ngo.tags) || "Address unavailable";
  const website = normalizeWebsite(ngo.tags?.website || ngo.tags?.url);

  return (
    <motion.div whileHover={{ y: -6 }} className="mb-4">
      <GlassPanel className={`p-4 ${selected ? 'ring-2 ring-cyan-400' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-premium-500 to-cyan-400 flex items-center justify-center text-white font-semibold shadow-md">
                NGO
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-base text-white truncate flex items-center gap-2">
                  {name}
                  {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-cyan-200 text-xs underline">
                      Site
                    </a>
                  )}
                </div>
                <div className="text-sm text-gray-300 truncate">{address}</div>
                <div className="text-xs text-gray-400 mt-1">{ngo.tags?.['office'] || ngo.tags?.['amenity'] || 'NGO'}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {distance !== undefined && (
              <div className="px-3 py-1 rounded-full bg-white/[0.06] text-sm text-white/[0.90] font-medium">
                {(distance / 1000).toFixed(2)} km
              </div>
            )}

            <Button variant={selected ? 'secondary' : 'primary'} size="sm" onClick={() => onSelect(ngo)}>
              {selected ? 'Selected' : 'Select'}
            </Button>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
