import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { deliveryAPI, donationAPI } from '@/lib/api';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { Truck, MapPin, Clock, CheckCircle, Navigation, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      deliveryAPI.getAll(),
      donationAPI.getAll({ status: 'claimed' }),
    ]).then(([delRes, donRes]) => {
      setDeliveries(delRes.data);
      setAvailable(donRes.data.donations);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const acceptDelivery = async (id) => {
    try {
      await deliveryAPI.assign(id);
      toast.success('Delivery accepted!');
      const res = await deliveryAPI.getAll();
      setDeliveries(res.data);
    } catch {}
  };

  const updateStatus = async (id, status) => {
    try {
      await deliveryAPI.updateStatus(id, { status, pickupTime: status === 'picked_up' ? new Date() : undefined, dropTime: status === 'delivered' ? new Date() : undefined });
      toast.success(`Delivery ${status}`);
      const res = await deliveryAPI.getAll();
      setDeliveries(res.data);
    } catch {}
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><div className="h-64 skeleton rounded-2xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display">Delivery Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage pickups and deliveries</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <Truck className="w-8 h-8 text-brand-500 mb-3" />
          <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'pending').length}</p>
          <p className="text-sm text-gray-500">Pending Pickups</p>
        </div>
        <div className="card p-5">
          <Navigation className="w-8 h-8 text-blue-500 mb-3" />
          <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'assigned' || d.status === 'picked_up').length}</p>
          <p className="text-sm text-gray-500">Active Deliveries</p>
        </div>
        <div className="card p-5">
          <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
          <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'delivered').length}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {deliveries.length > 0 ? (
          <div className="card p-6">
            <h3 className="font-semibold mb-4">My Deliveries</h3>
            <div className="space-y-3">
              {deliveries.map((d) => (
                <div key={d._id} className="p-4 rounded-xl border hover:border-brand-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{d.donation?.foodName || 'Delivery'}</span>
                    <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor(d.status))}>{d.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.pickupLocation?.address?.slice(0, 25)}</span>
                    <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> {d.dropLocation?.address?.slice(0, 25)}</span>
                  </div>
                  <div className="flex gap-2">
                    {d.status === 'pending' && <button onClick={() => acceptDelivery(d._id)} className="btn-primary text-xs flex-1">Accept</button>}
                    {d.status === 'assigned' && <button onClick={() => updateStatus(d._id, 'picked_up')} className="btn-primary text-xs flex-1">Mark Picked Up</button>}
                    {d.status === 'picked_up' && <button onClick={() => updateStatus(d._id, 'delivered')} className="btn-primary text-xs flex-1">Mark Delivered</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <Truck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No deliveries assigned yet</p>
          </div>
        )}

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Available Claims</h3>
          {available.length > 0 ? (
            <div className="space-y-3">
              {available.map((d) => (
                <div key={d._id} className="flex items-center justify-between p-3 rounded-xl border">
                  <div>
                    <p className="font-medium text-sm">{d.foodName}</p>
                    <p className="text-xs text-gray-500">{d.quantity} {d.unit}</p>
                  </div>
                  <button onClick={() => {}} className="btn-outline text-xs">Claim Delivery</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No available claims</p>
          )}
        </div>
      </div>
    </div>
  );
}
