import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { donationAPI } from '@/lib/api';
import { cn, getTimeRemaining, getStatusColor } from '@/lib/utils';
import { MapPin, Navigation, Clock, Users, Leaf } from 'lucide-react';
import FoodMap from './FoodMap';

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
            <FoodMap />
          </div>
        )}
      </div>
    </div>
  );
}
