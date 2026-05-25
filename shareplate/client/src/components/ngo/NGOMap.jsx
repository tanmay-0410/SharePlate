// src/components/ngo/NGOMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDisplayName, getAddress, normalizeWebsite } from "../../lib/ngoUtils";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon issue in Leaflet (use asset imports for Vite)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapCenter({ position }) {
  const map = useMap();
  React.useEffect(() => {
    if (position) map.setView(position, 14);
  }, [position, map]);
  return null;
}

export default function NGOMap({ userLocation, ngos, selectedNGO }) {
  return (
    <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg mb-6">
      <MapContainer
        center={userLocation || [20.5937, 78.9629]} // Default: India center
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here</Popup>
          </Marker>
        )}
        {ngos.map((ngo, idx) => {
          const lat = ngo.lat || ngo.center?.lat;
          const lon = ngo.lon || ngo.center?.lon;
          if (!lat || !lon) return null;
          const name = getDisplayName(ngo) || "NGO";
          const address = getAddress(ngo.tags) || "Address unavailable";
          const website = normalizeWebsite(ngo.tags?.website || ngo.tags?.url);
          return (
            <Marker key={ngo.id} position={[lat, lon]} opacity={selectedNGO && selectedNGO.id === ngo.id ? 1 : 0.85}>
              <Popup>
                <div className="font-bold mb-1">{name}</div>
                <div className="text-xs text-gray-600 mb-1">{address}</div>
                <div className="text-xs text-gray-500">
                  {website && (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      Website
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        <MapCenter position={userLocation} />
      </MapContainer>
    </div>
  );
}
