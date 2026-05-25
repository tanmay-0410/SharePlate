import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { donationAPI } from '@/lib/api';
import { cn, getTimeRemaining, getStatusColor } from '@/lib/utils';
import { MapPin, Navigation, Clock, Users, Leaf } from 'lucide-react';

export default function MapPage() {
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState({ lat: 28.6139, lng: 77.209 });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
    Promise.all([
      donationAPI.getAll({ status: 'available' }),
    ]).then(([donRes]) => {
      setDonations(donRes.data.donations);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const allLocations = [
    ...donations.filter(d => d.pickupLocation?.lat).map(d => ({
      type: 'donation',
      _id: d._id,
      name: d.foodName,
      lat: d.pickupLocation.lat,
      lng: d.pickupLocation.lng,
      address: d.pickupLocation.address,
      status: d.status,
      expiry: d.expiryTime,
      quantity: `${d.quantity} ${d.unit}`,
    })),
  ];

  const iconMap = { donation: { icon: '🍽️', color: 'bg-brand-500' } };

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 bg-gray-100">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading map data...</p>
            </div>
          </div>
        ) : (
          <div className="h-full relative">
            {/* Map placeholder with coordinates display */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center max-w-lg">
                <MapPin className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-display mb-2">Food Distribution Map</h3>
                <p className="text-gray-500 mb-4">
                  Google Maps integration shows nearby food donations, NGO locations, and optimized pickup routes.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full text-sm text-brand-700">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{userLoc.lat.toFixed(4)}, {userLoc.lng.toFixed(4)}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  <div className="card p-3 text-center">
                    <p className="text-2xl">🍽️</p>
                    <p className="font-bold text-lg">{donations.length}</p>
                    <p className="text-xs text-gray-500">Donations</p>
                  </div>
                  <div className="card p-3 text-center">
                    <p className="text-2xl">🏪</p>
                    <p className="font-bold text-lg">{ngos.length || '5+'}</p>
                    <p className="text-xs text-gray-500">NGOs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location cards overlay */}
            <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-2 pr-2">
              {allLocations.map((loc) => (
                <button
                  key={loc._id}
                  onClick={() => setSelected(loc)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl bg-white/90 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all',
                    selected?._id === loc._id ? 'ring-2 ring-brand-500' : ''
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{iconMap[loc.type]?.icon || '📍'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{loc.name}</p>
                      <p className="text-xs text-gray-500 truncate">{loc.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{loc.quantity}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {getTimeRemaining(loc.expiry)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
