import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Users, Brain, Heart, ArrowRight, Shield, Globe, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/[0.80] backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl font-bold font-display gradient-text">SharePlate</span>
          </Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" /> Our Mission
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display leading-tight mb-6">
              Reducing Food Waste,{' '}
              <span className="gradient-text">One Plate at a Time</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              SharePlate is an AI-powered platform that connects food donors with those in need. We believe that no good food should go to waste when there are people who need it.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'AI-Powered', desc: 'Advanced AI detects food type, freshness, and safety from images.' },
              { icon: Globe, title: 'Global Impact', desc: 'Connecting communities worldwide to fight hunger and reduce waste.' },
              { icon: Shield, title: 'Trusted Network', desc: 'Verified NGOs and delivery partners ensure safe redistribution.' },
              { icon: Users, title: 'Community Driven', desc: 'Built by people, for people. Every donation makes a difference.' },
              { icon: Award, title: 'Gamified Experience', desc: 'Earn rewards, badges, and recognition for your contributions.' },
              { icon: Heart, title: 'Zero Hunger Goal', desc: 'Aligned with UN SDG 2: Zero Hunger and SDG 12: Responsible Consumption.' },
            ].map((item) => (
              <motion.div key={item.title} whileHover={{ y: -4 }} className="card-hover p-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-display mb-8">Ready to Join?</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">Whether you&apos;re donating food, receiving it, or delivering it, you&apos;re making a difference.</p>
          <Link to="/register" className="btn-primary text-lg px-8 py-4">
            Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
