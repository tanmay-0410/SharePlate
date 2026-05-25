import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsAPI } from '@/lib/api';
import { Leaf, Users, UtensilsCrossed, TrendingDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7'];

export default function Impact() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [topDonors, setTopDonors] = useState([]);

  useEffect(() => {
    analyticsAPI.getStats().then((res) => setStats(res.data)).catch(() => {});
    analyticsAPI.getChart().then((res) => setChartData(res.data)).catch(() => {});
    analyticsAPI.getTopDonors().then((res) => setTopDonors(res.data)).catch(() => {});
  }, []);

  const impactMetrics = stats ? [
    { label: 'Food Saved', value: `${stats.totalFoodKg?.toLocaleString() || 0} kg`, icon: Leaf, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Meals Distributed', value: (stats.totalMealsServed?.toLocaleString() || '0'), icon: UtensilsCrossed, color: 'from-brand-500 to-brand-600' },
    { label: 'CO₂ Reduced', value: `${stats.carbonFootprintSaved?.toLocaleString() || 0} kg`, icon: TrendingDown, color: 'from-blue-500 to-blue-600' },
    { label: 'Active NGOs', value: stats.activeNGOs?.toString() || '0', icon: Users, color: 'from-purple-500 to-purple-600' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display">Impact Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time analytics of your community&apos;s impact</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {impactMetrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}>
              <m.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold font-display">{m.value}</p>
            <p className="text-sm text-gray-500">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Donation Trend</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="totalDonations" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Donation Breakdown</h3>
          {chartData.length > 0 && chartData[chartData.length - 1]?.donationsByType ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={[
                  { name: 'Vegetarian', value: chartData[chartData.length - 1].donationsByType?.veg || 0 },
                  { name: 'Non-Veg', value: chartData[chartData.length - 1].donationsByType?.nonVeg || 0 },
                ]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {[0, 1].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Top Donors</h3>
        {topDonors.length > 0 ? (
          <div className="space-y-3">
            {topDonors.map((donor, i) => (
              <div key={donor._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">#{i + 1}</span>
                  <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-white text-sm font-bold">
                    {donor.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{donor.name}</p>
                    <p className="text-xs text-gray-500">{donor.totalDonations} donations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-600">{donor.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No donor data yet</p>
        )}
      </div>
    </div>
  );
}
