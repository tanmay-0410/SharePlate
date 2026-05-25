import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDisplayName, getAddress, normalizeWebsite } from '../../lib/ngoUtils';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function NGOMapSimple({ userLocation, ngos = [], selectedNGO }) {
  const mapRef = useRef(null);
  const markersRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('ngo-map', { scrollWheelZoom: true }).setView(userLocation || [20.5937, 78.9629], 5);
      let errorCount = 0;
      let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      tileLayer.on('tileerror', () => {
        errorCount += 1;
        if (errorCount > 6) {
          // switch to Carto Voyager tiles as a fallback
          try {
            mapRef.current.removeLayer(tileLayer);
          } catch (e) {}
          tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors & CARTO',
          }).addTo(mapRef.current);
        }
      });
      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }
    const onResize = () => mapRef.current && mapRef.current.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      // do not remove the map on unmount to keep HMR stable
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    // move view to user location if provided
    if (userLocation) {
      mapRef.current.setView(userLocation, 13);
    }

    // clear previous markers
    markersRef.current.clearLayers();

    // add user marker
    if (userLocation) {
      L.marker(userLocation).bindPopup('You are here').addTo(markersRef.current);
    }

    ngos.forEach((ngo) => {
      const lat = ngo.lat || ngo.center?.lat;
      const lon = ngo.lon || ngo.center?.lon;
      if (!lat || !lon) return;
      const name = getDisplayName(ngo) || 'NGO';
      const address = getAddress(ngo.tags) || 'Address unavailable';
      const website = normalizeWebsite(ngo.tags?.website || ngo.tags?.url);
      const marker = L.marker([lat, lon]);
      const popupHtml = `<div style="font-weight:700;margin-bottom:4px">${name}</div><div style="font-size:12px;color:#555;margin-bottom:4px">${address}</div>${website?`<a href='${website}' target='_blank' rel='noreferrer' style='color:#2563eb;text-decoration:underline;font-size:12px'>Website</a>`:''}`;
      marker.bindPopup(popupHtml);
      marker.addTo(markersRef.current);
    });
      // ensure map redraws correctly after markers change
      setTimeout(() => {
        try {
          mapRef.current && mapRef.current.invalidateSize();
        } catch (e) {}
      }, 50);
  }, [userLocation, ngos, selectedNGO]);

  return (
    <div className="w-full h-80 md:h-[520px] rounded-2xl overflow-hidden shadow-2xl mb-6 border border-gray-700/[0.20]">
      <div id="ngo-map" className="w-full h-full" />
    </div>
  );
}
