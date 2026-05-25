// src/pages/FoodMap.jsx
import React, { useEffect, useState } from "react";
import DonationForm from "../components/donation/DonationForm";
import NGOMap from "../components/ngo/NGOMapSimple";
import NGOCard from "../components/ngo/NGOCard";
import NGOFilterChips from "../components/filters/NGOFilterChips";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import ErrorState from "../components/ui/ErrorState";
import ConfirmationModal from "../components/ui/ConfirmationModal";
import { fetchNearbyNGOs } from "../services/ngoService";
import { haversineDistance } from "../lib/distanceCalculator";
import GlassPanel from "../components/ui/GlassPanel";
import { motion } from "framer-motion";

export default function FoodMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [donationPayload, setDonationPayload] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (userLocation) {
      loadNGOs(userLocation.lat, userLocation.lon);
    }
  }, [userLocation]);

  // Development helper: auto-set a demo location when visiting /map-dev
  useEffect(() => {
    if (!userLocation && typeof window !== 'undefined' && window.location.pathname.includes('map-dev')) {
      setUserLocation({ lat: 28.6448, lon: 77.2167 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNGOs = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
    const elements = await fetchNearbyNGOs(lat, lon, 5000);
    setUsingDemoData(!!elements.find?.(e => e.isDemo));
    console.debug('fetchNearbyNGOs -> elements count', elements?.length, elements?.slice?.(0,3));
      // normalize elements into objects with lat/lon
      const normalized = elements.map((el) => {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        return { ...el, lat, lon };
      }).filter(e => e.lat && e.lon);

      // attach distance
      const withDistance = normalized.map((e) => ({
        ...e,
        distance: haversineDistance(lat, lon, e.lat, e.lon),
      }));

      withDistance.sort((a, b) => a.distance - b.distance);
      setNgos(withDistance);
      setFiltered(withDistance);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch NGOs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (!value) return setFiltered(ngos);
    const mapFilter = (ngo) => {
      const tags = JSON.stringify(ngo.tags || {}).toLowerCase();
      switch (value) {
        case "food":
          return tags.includes("food") || tags.includes("donation");
        case "child":
          return tags.includes("child") || tags.includes("children");
        case "women":
          return tags.includes("women") || tags.includes("shelter");
        case "education":
          return tags.includes("school") || tags.includes("education") || tags.includes("training");
        case "animal":
          return tags.includes("animal") || tags.includes("rescue") || tags.includes("pet");
        case "medical":
          return tags.includes("clinic") || tags.includes("hospital") || tags.includes("health") || tags.includes("medical");
        default:
          return true;
      }
    };
    setFiltered(ngos.filter(mapFilter));
  };

  const handleSelectNGO = (ngo) => {
    setSelectedNGO(ngo);
    setModalOpen(true);
  };

  const handleDonationSubmit = (payload) => {
    // payload contains donor form and lat/lon
    setDonationPayload(payload);
    if (payload.lat && payload.lon) setUserLocation({ lat: payload.lat, lon: payload.lon });
    // trigger loadNGOs will run via useEffect
  };

  const confirmDonation = async () => {
    const final = {
      donation: donationPayload,
      ngo: selectedNGO,
      userLocation,
    };
    // placeholder: send to backend (requires auth). For now, log and show success.
    console.log("Prepared donation payload:", final);
    setModalOpen(false);
    alert("Donation prepared — see console. Implement backend submit when ready.");
  };

  return (
    <div className="container mx-auto p-6">
      <motion.h2 className="text-2xl font-semibold mb-4 text-white">Food Map — Nearby NGO Finder</motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassPanel className="p-4">
            <DonationForm onLocation={({ lat, lon }) => setUserLocation({ lat, lon })} onSubmit={handleDonationSubmit} userLocation={userLocation} />
          </GlassPanel>

          <div className="mt-6">
            {loading ? (
              <SkeletonLoader count={3} height="h-48" />
            ) : error ? (
              <ErrorState message={error} onRetry={() => userLocation && loadNGOs(userLocation.lat, userLocation.lon)} />
            ) : (
              <>
                <GlassPanel className="overflow-hidden p-2 mb-3">
                  <NGOMap userLocation={userLocation ? [userLocation.lat, userLocation.lon] : null} ngos={filtered} selectedNGO={selectedNGO} />
                </GlassPanel>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-300">Found {filtered.length} NGOs within 5km</div>
                  <NGOFilterChips selected={selectedFilter} onChange={(v) => handleFilterChange(v)} />
                </div>

                <div>
                  {filtered.length === 0 ? (
                    <div className="p-6 bg-white/[0.06] rounded-xl">No nearby NGOs found. Try expanding your location or radius.</div>
                  ) : (
                    filtered.map((ngo) => (
                      <NGOCard key={ngo.id} ngo={ngo} distance={ngo.distance} onSelect={handleSelectNGO} selected={selectedNGO && selectedNGO.id === ngo.id} />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <aside className="lg:col-span-1 space-y-4">
          <GlassPanel className="p-4">
            <h4 className="font-semibold mb-2 text-white">Selection</h4>
            {selectedNGO ? (
              <div>
                <div className="font-bold text-white">{selectedNGO.tags?.name}</div>
                <div className="text-xs text-gray-300 mb-2">{selectedNGO.tags?.['addr:full'] || selectedNGO.tags?.['addr:street']}</div>
                <button onClick={() => setModalOpen(true)} className="px-3 py-2 bg-gradient-to-r from-premium-600 to-cyan-500 text-white rounded-lg">View & Confirm</button>
              </div>
            ) : (
              <div className="text-sm text-gray-300">Select an NGO from the list to prepare a donation.</div>
            )}

            <div className="mt-4 text-sm text-gray-400">
              <div className="mb-2">AI Recommendation: (coming soon)</div>
              <div className="text-xs">We'll analyze donation details to recommend the best NGO.</div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-4">
            <h4 className="font-semibold mb-2 text-white">Tips</h4>
            <ul className="text-sm text-gray-300 list-disc ml-5">
              <li>Provide accurate pickup address for smooth collection.</li>
              <li>Pack food safely and label perishable items.</li>
              <li>Use "Use my location" for best matchmaking.</li>
            </ul>
          </GlassPanel>
        </aside>
      </div>

      <ConfirmationModal open={modalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmDonation} title="Confirm Donation Details">
        <div>
          <div className="font-semibold">NGO</div>
          <div className="text-sm">{selectedNGO?.tags?.name || "—"}</div>
        </div>
        <div>
          <div className="font-semibold">Donor</div>
          <div className="text-sm">{donationPayload?.donorName || "—"} • {donationPayload?.phone || "—"}</div>
        </div>
        <div>
          <div className="font-semibold">Pickup</div>
          <div className="text-sm">{donationPayload?.pickupAddress || "—"}</div>
        </div>
      </ConfirmationModal>
    </div>
  );
}
