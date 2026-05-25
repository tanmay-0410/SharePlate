import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { donationAPI } from '@/lib/api';
import { cn, formatDate, formatDistance, getTimeRemaining, getStatusColor, getInitials } from '@/lib/utils';
import { MapPin, Clock, Filter, Search, UtensilsCrossed, Leaf, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Donations() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'available', type: '', search: '' });

  useEffect(() => {
    loadDonations();
  }, [filter.status, filter.type]);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.type) params.type = filter.type;
      const res = await donationAPI.getAll(params);
      setDonations(res.data.donations);
    } catch {}
    setLoading(false);
  };

  const handleClaim = async (id) => {
    try {
      await donationAPI.claim(id);
      toast.success('Donation claimed!');
      loadDonations();
    } catch {}
  };

  const filtered = donations.filter((d) =>
    d.foodName?.toLowerCase().includes(filter.search.toLowerCase()) ||
    d.description?.toLowerCase().includes(filter.search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display">Available Donations</h1>
            <p className="text-gray-500 mt-1">Browse and claim food donations near you</p>
          </div>
          {user?.role !== 'ngo' && <Link to="/donate" className="btn-primary">Donate Food</Link>}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search food..."
              className="input-field pl-9"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>
          <select className="input-field w-auto" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="available">Available</option>
            <option value="claimed">Claimed</option>
            <option value="delivered">Delivered</option>
            <option value="">All</option>
          </select>
          <select className="input-field w-auto" value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
            <option value="">All Types</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 skeleton rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No donations found</p>
            <Link to="/donate" className="btn-primary mt-4 inline-flex">Be the first to donate</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-hover overflow-hidden"
              >
                <div className="relative h-40 bg-gray-100">
                  {d.images?.[0] ? (
                    <img src={d.images[0]} alt={d.foodName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <UtensilsCrossed className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor(d.status))}>
                      {d.status}
                    </span>
                    {d.foodType === 'veg' ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> Veg
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Non-Veg
                      </span>
                    )}
                  </div>
                  {d.spoilageRisk === 'high' && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Spoilage Risk
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{d.foodName}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{d.description || 'No description'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="font-medium text-gray-700">{d.quantity} {d.unit}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {getTimeRemaining(d.expiryTime)}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <MapPin className="w-3 h-3 mr-1" />
                    {d.pickupLocation?.address?.slice(0, 40) || 'Location not set'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/donations/${d._id}`} className="btn-outline text-sm flex-1 text-center">Details</Link>
                    {d.status === 'available' && user?.role === 'ngo' && (
                      <button onClick={() => handleClaim(d._id)} className="btn-primary text-sm flex-1">Claim</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
