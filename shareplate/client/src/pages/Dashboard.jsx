import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { analyticsAPI, donationAPI, rewardAPI } from '@/lib/api';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { Leaf, Users, UtensilsCrossed, Award, TrendingUp, ArrowRight, Clock, MapPin, PlusCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [rewards, setRewards] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    analyticsAPI.getStats().then((res) => setStats(res.data)).catch(() => {});
    donationAPI.getAll({ limit: 5 }).then((res) => setDonations(res.data.donations)).catch(() => {});
    rewardAPI.getMyRewards().then((res) => setRewards(res.data)).catch(() => {});
    analyticsAPI.getChart().then((res) => setChartData(res.data)).catch(() => {});
  }, []);

  const quickActions = [
    { to: '/donate', icon: PlusCircle, label: 'Donate Food', color: 'text-brand-600 bg-brand-50' },
    { to: '/donations', icon: MapPin, label: 'Find Food', color: 'text-blue-600 bg-blue-50' },
    { to: '/impact', icon: TrendingUp, label: 'View Impact', color: 'text-purple-600 bg-purple-50' },
    { to: '/rewards', icon: Award, label: 'My Rewards', color: 'text-accent-600 bg-accent-50' },
  ];

  // Filter quick actions based on user role
  const filteredQuickActions = quickActions.filter((action) => {
    // Hide 'Donate Food' for NGOs
    if (action.to === '/donate' && user?.role === 'ngo') {
      return false;
    }
    return true;
  });

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold font-display">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Here&apos;s your impact overview</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filteredQuickActions.map((action) => (
          <Link key={action.to} to={action.to}>
            <motion.div whileHover={{ y: -2 }} className="card-hover p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', action.color)}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">{action.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Donations', value: stats.totalDonations || 0, icon: UtensilsCrossed, color: 'from-brand-500 to-brand-600' },
          { label: 'Meals Served', value: stats.totalMealsServed || 0, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Food Saved (kg)', value: stats.totalFoodKg || 0, icon: Leaf, color: 'from-emerald-500 to-emerald-600' },
          { label: 'CO₂ Reduced (kg)', value: stats.carbonFootprintSaved || 0, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', s.color)}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold font-display">{s.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Donation Trends</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="totalDonations" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">No chart data yet</div>
            )}
          </div>
        </div>
        <div>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Donations</h3>
              <Link to="/donations" className="text-sm text-brand-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {donations.slice(0, 5).map((d) => (
                <Link key={d._id} to={`/donations/${d._id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{d.foodName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(d.createdAt)}</p>
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor(d.status))}>{d.status}</span>
                </Link>
              ))}
              {donations.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No donations yet</p>}
            </div>
          </div>

          <div className="card p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">My Rewards</h3>
              <Link to="/rewards" className="text-sm text-brand-600 hover:underline">View</Link>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold font-display text-brand-600">{rewards?.points || 0}</p>
              <p className="text-sm text-gray-500">Points Earned</p>
              <div className="mt-3 flex justify-center gap-1">
                {rewards?.badges?.slice(0, 5).map((b, i) => (
                  <span key={i} className="text-xl" title={b.name}>{b.icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
