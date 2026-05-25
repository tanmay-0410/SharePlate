import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { donationAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { cn, formatDate, formatTime, getTimeRemaining, getStatusColor, getInitials } from '@/lib/utils';
import { MapPin, Clock, User, Leaf, AlertTriangle, ArrowLeft, Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DonationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donationAPI.getById(id).then((res) => { setDonation(res.data); setLoading(false); }).catch(() => { navigate('/donations'); });
  }, [id]);

  const handleClaim = async () => {
    try {
      await donationAPI.claim(id);
      toast.success('Donation claimed!');
      const res = await donationAPI.getById(id);
      setDonation(res.data);
    } catch {}
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this donation?')) return;
    await donationAPI.delete(id);
    toast.success('Donation cancelled');
    navigate('/donations');
  };

  const handleStatusUpdate = async (status) => {
    await donationAPI.updateStatus(id, status);
    toast.success(`Status updated to ${status}`);
    const res = await donationAPI.getById(id);
    setDonation(res.data);
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="h-96 skeleton rounded-2xl" /></div>;
  if (!donation) return null;

  const isOwner = user?._id === donation.donor?._id;
  const isNgo = user?.role === 'ngo';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="card overflow-hidden">
            <div className="h-64 bg-gray-100">
              {donation.images?.[0] ? (
                <img src={donation.images[0]} alt={donation.foodName} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300 text-lg">No image</div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold font-display">{donation.foodName}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor(donation.status))}>{donation.status}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${donation.foodType === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {donation.foodType}
                    </span>
                    {donation.spoilageRisk === 'high' && <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Spoilage Risk</span>}
                  </div>
                </div>
                <span className="text-2xl font-bold text-brand-600">{donation.quantity} {donation.unit}</span>
              </div>
              <p className="text-gray-600">{donation.description || 'No description provided.'}</p>

              {donation.aiAnalysis && (
                <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
                  <p className="font-semibold text-brand-700 mb-2 flex items-center gap-2"><Leaf className="w-4 h-4" /> AI Analysis</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Detected:</span> {donation.aiAnalysis.foodName}</div>
                    <div><span className="text-gray-500">Freshness:</span> {donation.aiAnalysis.freshnessHours}h</div>
                    <div><span className="text-gray-500">Safe:</span> {donation.aiAnalysis.isSafe ? 'Yes' : 'No'}</div>
                    <div><span className="text-gray-500">Risk:</span> {donation.aiAnalysis.spoilageRisk}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-500" /> Time Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Listed:</span> <span>{formatDate(donation.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Expires:</span> <span className={cn('font-medium', donation.status === 'available' ? 'text-red-600' : '')}>{getTimeRemaining(donation.expiryTime)}</span></div>
              {donation.freshnessHours && <div className="flex justify-between"><span className="text-gray-500">Freshness:</span> <span>{donation.freshnessHours} hours</span></div>}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500" /> Pickup Location</h3>
            <p className="text-sm text-gray-600">{donation.pickupLocation?.address || 'Address not set'}</p>
            {donation.pickupLocation?.lat && (
              <p className="text-xs text-gray-400 mt-1">{donation.pickupLocation.lat.toFixed(4)}, {donation.pickupLocation.lng.toFixed(4)}</p>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4 text-brand-500" /> Donor</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-white text-sm font-bold">
                {getInitials(donation.donor?.name)}
              </div>
              <div>
                <p className="font-medium text-sm">{donation.donor?.name}</p>
                <p className="text-xs text-gray-500">{donation.donor?.email}</p>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="space-y-2">
              {donation.status === 'available' && (
                <button onClick={() => handleStatusUpdate('expired')} className="btn-secondary w-full text-sm">Mark as Expired</button>
              )}
              {donation.status === 'claimed' && (
                <button onClick={() => handleStatusUpdate('picked_up')} className="btn-primary w-full text-sm">Mark Picked Up</button>
              )}
              {donation.status === 'picked_up' && (
                <button onClick={() => handleStatusUpdate('delivered')} className="btn-primary w-full text-sm">Mark Delivered</button>
              )}
              <button onClick={handleCancel} className="flex items-center justify-center gap-2 w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" /> Cancel Donation
              </button>
            </div>
          )}

          {isNgo && donation.status === 'available' && !isOwner && (
            <button onClick={handleClaim} className="btn-primary w-full">Claim This Donation</button>
          )}

          {!isOwner && !isNgo && donation.status === 'available' && (
            <div className="card p-5 bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-700">Only NGOs can claim food donations. You can view details and learn about this donation.</p>
            </div>
          )}

          {isAdmin && !isOwner && (
            <button onClick={() => handleStatusUpdate('cancelled')} className="flex items-center justify-center gap-2 w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" /> Remove Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
