// src/components/donation/DonationForm.jsx
import React, { useEffect, useState } from "react";

export default function DonationForm({ onLocation, onSubmit, userLocation }) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [form, setForm] = useState({
    foodType: "Cooked Food",
    quantity: "1",
    donorName: "",
    phone: "",
    pickupAddress: "",
    notes: "",
    lat: null,
    lon: null,
  });

  useEffect(() => {
    // Auto-get location on mount
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setForm((s) => ({ ...s, lat, lon }));
          setLoadingLocation(false);
          setLocationError(null);
          onLocation && onLocation({ lat, lon });
        },
        (err) => {
          setLocationError(err.message || "Location unavailable");
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationError("Geolocation not supported");
    }
  }, [onLocation]);

  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lon) {
      setForm((s) => ({ ...s, lat: userLocation.lat, lon: userLocation.lon }));
    }
  }, [userLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.donorName || !form.phone || !form.pickupAddress) {
      alert("Please fill name, phone and pickup address");
      return;
    }
    const payload = { ...form };
    onSubmit && onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Food type</label>
          <select name="foodType" value={form.foodType} onChange={handleChange} className="mt-1 w-full rounded-lg p-2 border">
            <option>Cooked Food</option>
            <option>Packaged Food</option>
            <option>Fruits & Vegetables</option>
            <option>Dry Goods</option>
            <option>Other</option>
          </select>
        </div>
        <div className="w-32">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <input name="quantity" value={form.quantity} onChange={handleChange} className="mt-1 w-full rounded-lg p-2 border" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Donor name</label>
          <input name="donorName" value={form.donorName} onChange={handleChange} className="mt-1 w-full rounded-lg p-2 border" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Phone number</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full rounded-lg p-2 border" />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700">Pickup address</label>
        <input name="pickupAddress" value={form.pickupAddress} onChange={handleChange} className="mt-1 w-full rounded-lg p-2 border" placeholder="Street, landmark, city" />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="mt-1 w-full rounded-lg p-2 border" rows={3} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loadingLocation ? (
            <span>Fetching location...</span>
          ) : locationError ? (
            <span className="text-red-500">{locationError}</span>
          ) : form.lat && form.lon ? (
            <span>Location captured • {(form.lat).toFixed(4)}, {(form.lon).toFixed(4)}</span>
          ) : (
            <span>Location not available</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => {
            // re-request location
            if (navigator.geolocation) {
              setLoadingLocation(true);
              navigator.geolocation.getCurrentPosition((pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setForm((s) => ({ ...s, lat, lon }));
                setLoadingLocation(false);
                setLocationError(null);
                onLocation && onLocation({ lat, lon });
              }, (err) => {
                setLocationError(err.message || "Location unavailable");
                setLoadingLocation(false);
              });
            }
          }} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">Use my location</button>

          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">Find NGOs</button>
        </div>
      </div>
    </form>
  );
}
