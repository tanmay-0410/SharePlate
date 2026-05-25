import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Users, MapPin, Shield, Brain, Zap, Award, ChevronDown, Star, UtensilsCrossed, Building2, GraduationCap, Home, Truck, HeartHandshake } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/layout/Footer';

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const stats = [
  { value: '10M+', label: 'Meals Saved', icon: UtensilsCrossed },
  { value: '5,000+', label: 'Active Users', icon: Users },
  { value: '2,000+', label: 'Partner NGOs', icon: Building2 },
  { value: '15M kg', label: 'CO₂ Reduced', icon: Leaf },
];

const features = [
  { icon: Brain, title: 'AI Food Detection', description: 'Upload a photo and our AI instantly identifies food type, freshness, and safety.' },
  { icon: MapPin, title: 'Smart Location Matching', description: 'Google Maps integration finds the nearest NGOs and pickup points automatically.' },
  { icon: Zap, title: 'Real-Time Notifications', description: 'Get instant alerts for nearby food donations, pickups, and delivery updates.' },
  { icon: Shield, title: 'Verified Network', description: 'All NGOs and partners are verified to ensure safe and reliable redistribution.' },
  { icon: Award, title: 'Gamified Rewards', description: 'Earn points, badges, and climb the leaderboard for every donation you make.' },
  { icon: Truck, title: 'Delivery Management', description: 'Optimized routes for delivery partners with ETA tracking and status updates.' },
];

const howItWorks = [
  { step: '1', title: 'Upload Food', desc: 'Take a photo of surplus food. AI analyzes type, quantity, and freshness.' },
  { step: '2', title: 'AI Matches', desc: 'Our algorithm matches with nearby NGOs and people in need.' },
  { step: '3', title: 'Smart Pickup', desc: 'Delivery partners are notified for optimized pickup routes.' },
  { step: '4', title: 'Track Impact', desc: 'See real-time analytics of meals saved and your impact.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Restaurant Owner', text: 'SharePlate helped us reduce food waste by 80%. The AI detection is incredibly accurate.', avatar: 'PS', rating: 5 },
  { name: 'Rahul Verma', role: 'NGO Coordinator', text: 'We now receive quality food daily. The matching system ensures nothing goes to waste.', avatar: 'RV', rating: 5 },
  { name: 'Ananya Patel', role: 'Student', text: 'I get nutritious meals through SharePlate. It\'s helping me focus on my studies.', avatar: 'AP', rating: 5 },
];

const roles = [
  { icon: Building2, title: 'Restaurants', desc: 'Donate surplus food' },
  { icon: HeartHandshake, title: 'NGOs', desc: 'Receive & distribute' },
  { icon: GraduationCap, title: 'Students', desc: 'Access free meals' },
  { icon: Home, title: 'Home Donors', desc: 'Share extra food' },
  { icon: Truck, title: 'Delivery Partners', desc: 'Earn while delivering' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600 font-display">SharePlate</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50 opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" /> AI-Powered Food Redistribution
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
                Stop Food Waste.{' '}
                <span className="gradient-text">Feed the Future.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                SharePlate uses artificial intelligence to intelligently redistribute surplus food from restaurants, events, and homes to NGOs and people in need. Reduce waste, fight hunger.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={user ? '/donate' : '/register'} className="btn-primary text-lg px-8 py-4">
                  Start Donating <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/about" className="btn-secondary text-lg px-8 py-4">
                  Learn More
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-8 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {['P','R','A','K'][i-1]}
                    </div>
                  ))}
                </div>
                <span>Trusted by <strong>5,000+</strong> users</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-brand-600/20 rounded-3xl" />
                <div className="relative glass rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 text-white">
                      <UtensilsCrossed className="w-8 h-8 mb-2" />
                      <p className="text-3xl font-bold">2,500 kg</p>
                      <p className="text-brand-100 text-sm">Food saved today</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border">
                      <Leaf className="w-6 h-6 text-brand-500 mb-1" />
                      <p className="font-bold text-xl">5,000+</p>
                      <p className="text-xs text-gray-500">Meals distributed</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border">
                      <Users className="w-6 h-6 text-accent-500 mb-1" />
                      <p className="font-bold text-xl">200+</p>
                      <p className="text-xs text-gray-500">Active NGOs</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-4">Who is SharePlate for?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everyone has a role to play in reducing food waste. Here&apos;s how you can contribute.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {roles.map((role) => (
              <motion.div key={role.title} whileHover={{ y: -4 }} className="card-hover p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
                  <role.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm">{role.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{role.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 gradient-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-white">
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <p className="text-4xl font-bold font-display mb-1">{stat.value}</p>
                <p className="text-brand-100 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-4">How SharePlate Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Four simple steps to make a difference.</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: item.step * 0.1 }} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-4">Powered by AI, Driven by Humanity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Advanced technology meets social impact to create a sustainable food ecosystem.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <motion.div key={feature.title} whileHover={{ y: -4 }} className="card-hover p-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-4">What Users Say</h2>
            <p className="text-gray-600">Real stories from our community.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-hover p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent-400 text-accent-400" />)}
                </div>
                <p className="text-gray-600 text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-green">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already reducing food waste and fighting hunger with SharePlate.
            </p>
            <Link to={user ? '/donate' : '/register'} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all hover:scale-105">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
