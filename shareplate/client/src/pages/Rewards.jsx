import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { rewardAPI } from '@/lib/api';
import { Award, Zap, TrendingUp, Star, Trophy, Medal, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const BADGE_ICONS = { 'First Donation': '🌟', 'Helping Hand': '🤝', 'Food Hero': '🦸', 'Community Champion': '🏆', 'Life Saver': '❤️', 'Legend': '👑' };

export default function Rewards() {
  const [rewards, setRewards] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [tab, setTab] = useState('my');

  useEffect(() => {
    rewardAPI.getMyRewards().then((res) => setRewards(res.data)).catch(() => {});
    rewardAPI.getLeaderboard().then((res) => setLeaderboard(res.data)).catch(() => {});
    rewardAPI.getBadges().then((res) => setBadges(res.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display">Rewards & Leaderboard</h1>
        <p className="text-gray-500 mt-1">Earn points and climb the ranks for every donation</p>
      </motion.div>

      <div className="flex gap-2">
        <button onClick={() => setTab('my')} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-colors', tab === 'my' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>My Rewards</button>
        <button onClick={() => setTab('badges')} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-colors', tab === 'badges' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>Badges</button>
        <button onClick={() => setTab('leaderboard')} className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-colors', tab === 'leaderboard' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>Leaderboard</button>
      </div>

      {tab === 'my' && rewards && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <p className="text-4xl font-bold font-display text-brand-600">{rewards.points}</p>
            <p className="text-gray-500">Total Points</p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-4xl font-bold font-display text-blue-600">{rewards.totalDonations}</p>
            <p className="text-gray-500">Donations Made</p>
          </div>
          <div className="card p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <p className="text-4xl font-bold font-display text-purple-600">#{rewards.rank}</p>
            <p className="text-gray-500">of {rewards.totalUsers} users</p>
          </div>
        </div>
      )}

      {tab === 'badges' && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
            <div key={badge.name} className={cn('card p-6 text-center transition-all', badge.earned ? 'border-brand-200 bg-brand-50/[0.50]' : 'opacity-50')}>
              <span className="text-5xl block mb-3">{BADGE_ICONS[badge.name] || '🏅'}</span>
              <h3 className="font-semibold">{badge.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{badge.earned ? 'Earned!' : `${Math.round(badge.progress * 100)}% complete`}</p>
              <div className="mt-3 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all" style={{ width: `${Math.min(badge.progress * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="card">
          <div className="p-4 border-b flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent-500" />
            <span className="font-semibold">Top Contributors</span>
          </div>
          <div className="divide-y">
            {leaderboard.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={cn('text-lg font-bold w-8', i === 0 ? 'text-accent-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-300')}>
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                  </span>
                  <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-white text-sm font-bold">
                    {entry.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.totalDonations} donations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-600">{entry.points} pts</p>
                  <div className="flex gap-0.5">{entry.badges?.slice(0, 3).map((b, j) => <span key={j} className="text-xs">{BADGE_ICONS[b.name] || '🏅'}</span>)}</div>
                </div>
              </div>
            ))}
            {leaderboard.length === 0 && <p className="p-8 text-center text-gray-400">No data yet</p>}
          </div>
        </div>
      )}
    </div>
  );
}
