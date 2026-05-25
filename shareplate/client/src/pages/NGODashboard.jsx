import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { donationAPI, ngoAPI } from '@/lib/api';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { Users, UtensilsCrossed, MapPin, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function NGODashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [claimed, setClaimed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      donationAPI.getAll({ status: 'available' }),
    ]).then(([res]) => {
      setDonations(res.data.donations.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="h-64 skeleton rounded-2xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display">NGO Dashboard</h1>
        <p className="text-gray-500 mt-1">Browse and claim food donations for distribution</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <Users className="w-8 h-8 text-brand-500 mb-3" />
          <p className="text-2xl font-bold">{donations.length}</p>
          <p className="text-sm text-gray-500">Available Donations</p>
        </div>
        <div className="card p-5">
          <UtensilsCrossed className="w-8 h-8 text-blue-500 mb-3" />
          <p className="text-2xl font-bold">{claimed.length || 0}</p>
          <p className="text-sm text-gray-500">Claimed</p>
        </div>
        <div className="card p-5">
          <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">Delivered</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Available Donations</h3>
          <Link to="/donations" className="text-sm text-brand-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {donations.map((d) => (
            <Link key={d._id} to={`/donations/${d._id}`} className="flex items-center justify-between p-4 rounded-xl border hover:border-brand-200 hover:bg-brand-50/50 transition-colors">
              <div>
                <p className="font-medium">{d.foodName}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.pickupLocation?.address?.slice(0, 30)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{d.quantity} {d.unit}</p>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', getStatusColor(d.status))}>{d.status}</span>
              </div>
            </Link>
          ))}
          {donations.length === 0 && (
            <div className="md:col-span-2 text-center py-8 text-gray-400">No donations available right now</div>
          )}
        </div>
      </div>
    </div>
  );
}
