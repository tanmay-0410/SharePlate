import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsAPI, donationAPI } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Users, Shield, Activity, AlertTriangle, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function Admin() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    analyticsAPI.getStats().then((res) => setStats(res.data)).catch(() => {});
    analyticsAPI.getChart().then((res) => setChartData(res.data)).catch(() => {});
    donationAPI.getAll({ limit: 10 }).then((res) => setDonations(res.data.donations)).catch(() => {});
  }, []);

  const removeDonation = async (id) => {
    if (!confirm('Remove this donation?')) return;
    await donationAPI.delete(id);
    toast.success('Donation removed');
    setDonations((prev) => prev.filter((d) => d._id !== id));
  };

  const adminStats = [
    { label: 'Total Users', value: stats?.activeUsers || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Active NGOs', value: stats?.activeNGOs || 0, icon: Shield, color: 'bg-green-500' },
    { label: 'Total Donations', value: stats?.totalDonations || 0, icon: Activity, color: 'bg-purple-500' },
    { label: 'Today', value: stats?.todayDonations || 0, icon: BarChart3, color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage users, donations, and platform analytics</p>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {['overview', 'donations', 'users'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors', tab === t ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adminStats.map((s) => (
              <div key={s.label} className="card p-5">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white', s.color)}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold font-display">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Platform Growth</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="totalDonations" stroke="#22c55e" strokeWidth={2} name="Donations" />
                  <Line type="monotone" dataKey="activeNGOs" stroke="#3b82f6" strokeWidth={2} name="NGOs" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No data yet</div>
            )}
          </div>
        </>
      )}

      {tab === 'donations' && (
        <div className="card">
          <div className="p-4 border-b flex items-center justify-between">
            <span className="font-semibold">All Donations</span>
            <span className="text-sm text-gray-500">{donations.length} total</span>
          </div>
          <div className="divide-y">
            {donations.map((d) => (
              <div key={d._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-sm">{d.foodName}</p>
                  <p className="text-xs text-gray-500">{d.quantity} {d.unit} · {d.status}</p>
                </div>
                <button onClick={() => removeDonation(d._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
            {donations.length === 0 && <p className="p-8 text-center text-gray-400">No donations</p>}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card p-6 text-center">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">User management interface would list all users with options to verify NGOs, ban users, etc.</p>
        </div>
      )}
    </div>
  );
}
