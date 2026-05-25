import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/context/AuthContext';
import { donationAPI, uploadAPI } from '@/lib/api';
import { cn, getInitials } from '@/lib/utils';
import { Camera, Upload, Mic, MapPin, Leaf, Loader2, Image, X, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Donate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [form, setForm] = useState({
    foodName: '', description: '', quantity: '', unit: 'kg', foodType: 'veg',
    category: 'cooked', expiryTime: '', pickupLocation: { address: '', lat: 0, lng: 0 },
  });
  const [images, setImages] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [listening, setListening] = useState(false);

  // Redirect NGOs to donations page
  useEffect(() => {
    if (user?.role === 'ngo') {
      toast.error('NGOs can only claim food, not donate');
      navigate('/donations');
    }
  }, [user, navigate]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      setImages([base64]);
      setAnalyzing(true);
      try {
        const res = await donationAPI.analyze(base64);
        if (res.data) {
          setAiResult(res.data);
          setForm((prev) => ({
            ...prev,
            foodName: res.data.foodName || prev.foodName,
            foodType: res.data.category === 'non-veg' ? 'non-veg' : res.data.foodType || 'veg',
          }));
          toast.success('AI analysis complete!');
        }
      } catch (err) {
        toast.error('AI analysis failed. You can fill details manually.');
      }
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setForm((prev) => ({ ...prev, description: prev.description + ' ' + text }));
      toast.success('Voice captured!');
    };
    recognition.start();
    setListening(true);
    recognition.onend = () => setListening(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('pickup.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, pickupLocation: { ...prev.pickupLocation, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            pickupLocation: { ...prev.pickupLocation, lat: pos.coords.latitude, lng: pos.coords.longitude },
          }));
          toast.success('Location detected!');
        },
        () => toast.error('Could not get location')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrls = [];
      if (images.length > 0) {
        const res = await uploadAPI.base64(images[0]);
        imageUrls = [res.data.url];
      }

      const payload = {
        ...form,
        quantity: parseFloat(form.quantity),
        images: imageUrls,
        expiryTime: form.expiryTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        aiAnalysis: aiResult,
        freshnessHours: aiResult?.freshnessHours || 24,
        spoilageRisk: aiResult?.spoilageRisk || 'low',
        isSafe: aiResult?.isSafe !== false,
      };
      await donationAPI.create(payload);
      toast.success('Donation listed successfully!');
      navigate('/donations');
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display mb-2">Donate Food</h1>
        <p className="text-gray-500 mb-8">Share your surplus food with those who need it most</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload with AI */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-500" /> Food Image <span className="text-xs text-gray-400 font-normal">(AI will analyze)</span>
            </h3>
            <div {...getRootProps()} className={cn('border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors', isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-300')}>
              <input {...getInputProps()} />
              {images.length > 0 ? (
                <div className="relative inline-block">
                  <img src={images[0]} alt="Food" className="max-h-48 rounded-xl mx-auto" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setImages([]); setAiResult(null); }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    {isDragActive ? 'Drop image here' : 'Drag & drop food image, or click to browse'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
            {analyzing && (
              <div className="flex items-center gap-2 mt-4 text-brand-600">
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...
              </div>
            )}
            {aiResult && !analyzing && (
              <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
                <p className="font-semibold text-brand-700 mb-2 flex items-center gap-2"><Leaf className="w-4 h-4" /> AI Analysis</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Food:</span> <span className="font-medium">{aiResult.foodName}</span></div>
                  <div><span className="text-gray-500">Freshness:</span> <span className="font-medium">{aiResult.freshnessHours}h</span></div>
                  <div><span className="text-gray-500">Safe to eat:</span> <span className={aiResult.isSafe ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{aiResult.isSafe ? 'Yes' : 'No'}</span></div>
                  <div><span className="text-gray-500">Spoilage risk:</span> <span className="font-medium capitalize">{aiResult.spoilageRisk}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Food Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Food Name</label>
                <input name="foodName" className="input-field" placeholder="e.g., Vegetable Biryani" value={form.foodName} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Quantity</label>
                <input name="quantity" type="number" step="0.1" min="0.1" className="input-field" placeholder="2.5" value={form.quantity} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Unit</label>
                <select name="unit" className="input-field" value={form.unit} onChange={handleChange}>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="liters">Liters</option>
                  <option value="pieces">Pieces</option>
                  <option value="servings">Servings</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Food Type</label>
                <select name="foodType" className="input-field" value={form.foodType} onChange={handleChange}>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select name="category" className="input-field" value={form.category} onChange={handleChange}>
                  <option value="cooked">Cooked</option>
                  <option value="raw">Raw</option>
                  <option value="packaged">Packaged</option>
                  <option value="beverage">Beverage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                  Description
                  <button type="button" onClick={startVoiceInput} className={cn('p-1 rounded-lg transition-colors', listening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-brand-500 hover:bg-gray-100')} title="Voice input">
                    <Mic className="w-4 h-4" />
                  </button>
                </label>
                <textarea name="description" className="input-field min-h-[80px]" placeholder="Describe the food (or use voice input)" value={form.description} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Expiry Time</label>
                <input name="expiryTime" type="datetime-local" className="input-field" value={form.expiryTime} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-500" /> Pickup Location</h3>
              <button type="button" onClick={getLocation} className="text-sm text-brand-600 hover:underline flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Detect my location
              </button>
            </div>
            <div className="space-y-4">
              <input name="pickup.address" className="input-field" placeholder="Full address" value={form.pickupLocation.address} onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-4">
                <input name="pickup.lat" type="number" step="any" className="input-field" placeholder="Latitude" value={form.pickupLocation.lat || ''} onChange={handleChange} />
                <input name="pickup.lng" type="number" step="any" className="input-field" placeholder="Longitude" value={form.pickupLocation.lng || ''} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading || analyzing} className="btn-primary w-full py-4 text-lg">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Listing Donation...</> : 'List Donation'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
