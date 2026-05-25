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
    <form onSubmit={handleSubmit} className="form-panel">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-white">Food type</label>
          <select name="foodType" value={form.foodType} onChange={handleChange} className="mt-1 w-full input-field">
            <option>Cooked Food</option>
            <option>Packaged Food</option>
            <option>Fruits & Vegetables</option>
            <option>Dry Goods</option>
            <option>Other</option>
          </select>
        </div>
        <div className="w-32">
          <label className="text-sm font-medium text-white">Quantity</label>
          <input name="quantity" value={form.quantity} onChange={handleChange} className="mt-1 w-full input-field" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-white">Donor name</label>
          <input name="donorName" value={form.donorName} onChange={handleChange} className="mt-1 w-full input-field" />
        </div>
        <div>
          <label className="text-sm font-medium text-white">Phone number</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full input-field" />
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-white">Pickup address</label>
        <input name="pickupAddress" value={form.pickupAddress} onChange={handleChange} className="mt-1 w-full input-field" placeholder="Street, landmark, city" />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-white">Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="mt-1 w-full input-field" rows={3} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loadingLocation ? (
            <span>Fetching location...</span>
          ) : locationError ? (
            <span className="text-red-400">{locationError}</span>
          ) : form.lat && form.lon ? (
            <span className="text-white">Location captured • {(form.lat).toFixed(4)}, {(form.lon).toFixed(4)}</span>
          ) : (
            <span className="text-white/[0.70]">Location not available</span>
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
          }} className="btn-secondary">Use my location</button>

          <button type="submit" className="btn-primary">Find NGOs</button>
        </div>
      </div>
    </form>
  );
}
