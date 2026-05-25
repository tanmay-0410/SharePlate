import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-lg font-bold text-white font-display">SharePlate</span>
            </div>
            <p className="text-sm text-gray-400">
              AI-powered food redistribution platform reducing waste and ending hunger.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <div className="space-y-2 text-sm">
              <Link to="/donate" className="block hover:text-brand-400">Donate Food</Link>
              <Link to="/donations" className="block hover:text-brand-400">Browse Food</Link>
              <Link to="/map" className="block hover:text-brand-400">Food Map</Link>
              <Link to="/impact" className="block hover:text-brand-400">Impact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">For</h4>
            <div className="space-y-2 text-sm">
              <Link to="/register" className="block hover:text-brand-400">Restaurants</Link>
              <Link to="/register" className="block hover:text-brand-400">NGOs</Link>
              <Link to="/register" className="block hover:text-brand-400">Delivery Partners</Link>
              <Link to="/register" className="block hover:text-brand-400">Home Donors</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="space-y-2 text-sm">
              <a href="mailto:hello@shareplate.ai" className="flex items-center gap-2 hover:text-brand-400">
                <Mail className="w-4 h-4" /> hello@shareplate.ai
              </a>
              <div className="flex gap-3 mt-3">
                <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; 2024 SharePlate. All rights reserved.</p>
          <p className="flex items-center gap-1 text-gray-500">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
}
