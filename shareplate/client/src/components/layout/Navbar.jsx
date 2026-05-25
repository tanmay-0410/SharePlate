import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { notificationAPI } from '@/lib/api';
import GlassPanel from '@/components/ui/GlassPanel';
import Button from '@/components/ui/Button';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/donate', label: 'Donate Food' },
  { path: '/donations', label: 'Browse' },
  { path: '/map', label: 'Food Map' },
  { path: '/impact', label: 'Impact' },
  { path: '/rewards', label: 'Rewards' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Filter nav links based on user role
  const getFilteredLinks = () => {
    return navLinks.filter((link) => {
      // Hide 'Donate Food' for NGOs
      if (link.path === '/donate' && user?.role === 'ngo') {
        return false;
      }
      return true;
    });
  };
  
  const filteredNavLinks = getFilteredLinks();

  useEffect(() => {
    if (user) {
      notificationAPI.getAll().then((res) => {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      });
    }
  }, [user]);

  const handleMarkRead = async () => {
    await notificationAPI.markRead();
    setUnreadCount(0);
  };

  return (
    <nav className="sticky top-4 z-50 px-4">
      <GlassPanel className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-premium-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-base font-semibold">S</span>
            </div>
            <span className="text-lg font-semibold tracking-tight bg-clip-text gradient-text">SharePlate</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  location.pathname === link.path
                    ? 'text-white bg-gradient-to-r from-premium-600 to-cyan-600 shadow-md'
                    : 'text-gray-200 hover:text-white hover:scale-105'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
            >
              <Bell className="w-5 h-5 text-white/[0.80]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-gray-900/[0.90] rounded-2xl shadow-2xl border border-gray-800/[0.40] backdrop-blur-md overflow-hidden"
                >
                  <div className="p-3 border-b flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkRead} className="text-xs text-cyan-400 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.slice(0, 5).map((n) => (
                      <div key={n._id} className={cn('p-3 border-b last:border-0 text-sm', !n.isRead && 'bg-white/[0.05]')}>
                        <p className="font-medium text-white">{n.title}</p>
                        <p className="text-gray-400 text-xs">{n.message}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="p-4 text-center text-gray-400 text-sm">No notifications</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.05] transition-colors"
              >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-premium-500 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-white/[0.70]" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-900/[0.85] rounded-2xl shadow-2xl border border-gray-800/[0.30] backdrop-blur-md overflow-hidden"
                >
                  <div className="p-3 border-b">
                    <p className="font-medium text-sm truncate text-white">{user?.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800 text-white">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-800 text-white">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setProfileOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/[0.20] w-full">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/[0.05]"
          >
            {mobileOpen ? <X className="w-5 h-5 text-white/[0.80]" /> : <Menu className="w-5 h-5 text-white/[0.80]" />}
          </button>
        </div>
      </GlassPanel>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mx-auto max-w-7xl mt-3"
          >
            <GlassPanel className="px-4 py-3">
              <div className="space-y-2">
                {filteredNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block px-3 py-2 rounded-lg text-sm font-medium',
                      location.pathname === link.path
                        ? 'text-white bg-gradient-to-r from-premium-600 to-cyan-600'
                        : 'text-gray-200 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
