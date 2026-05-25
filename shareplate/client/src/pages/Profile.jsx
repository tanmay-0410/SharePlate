import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@/context/AuthContext';
import { authAPI, uploadAPI, userAPI } from '@/lib/api';
import { cn, getInitials } from '@/lib/utils';
import { User, Mail, Phone, MapPin, Shield, Save, Loader2, Upload, X, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', address: user?.address || { street: '', city: '', state: '' },
  });
  const [saving, setSaving] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [selectedCertType, setSelectedCertType] = useState(null);

  const onDrop = async (acceptedFiles, certType) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadingCert(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('certificateType', certType);

      // Upload to cloudinary
      const uploadRes = await uploadAPI.certificate(formData);
      
      // Save certificate info to user
      await userAPI.uploadCertificate({
        certificateType: certType,
        url: uploadRes.data.url,
      });

      updateUser({
        certificates: {
          ...user?.certificates,
          [certType]: { url: uploadRes.data.url, uploadedAt: new Date() },
        },
      });

      toast.success(`${certType.toUpperCase()} certificate uploaded successfully!`);
      setSelectedCertType(null);
    } catch (error) {
      toast.error('Failed to upload certificate');
    }
    setUploadingCert(false);
  };

  const CertificateDropZone = ({ certType }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (files) => onDrop(files, certType),
      accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.pdf'] },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024,
    });

    const cert = user?.certificates?.[certType];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">{certType.toUpperCase()} Certificate</label>
          {cert && <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"><FileCheck className="w-3 h-3" /> Uploaded</span>}
        </div>
        {!selectedCertType || selectedCertType !== certType ? (
          <button
            onClick={() => setSelectedCertType(certType)}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600"
          >
            <Upload className="w-4 h-4" /> {cert ? 'Update Certificate' : 'Upload Certificate'}
          </button>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <input {...getInputProps()} />
            {uploadingCert ? (
              <div className="flex items-center justify-center gap-2 text-brand-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </div>
            ) : (
              <div>
                <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Drag your certificate here</p>
                <p className="text-xs text-gray-500">or click to select (PDF, PNG, JPG, max 10MB)</p>
              </div>
            )}
          </div>
        )}
        {selectedCertType === certType && (
          <button
            onClick={() => setSelectedCertType(null)}
            className="w-full text-sm text-gray-600 hover:text-gray-900 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data);
      toast.success('Profile updated');
    } catch {}
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display mb-8">Profile</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card p-6 text-center sticky top-24">
              <div className="w-20 h-20 rounded-full gradient-green flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {user?.photoURL ? <img src={user.photoURL} className="w-20 h-20 rounded-full object-cover" /> : getInitials(user?.name)}
              </div>
              <h2 className="text-xl font-bold font-display">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium capitalize">
                <Shield className="w-3 h-3" /> {user?.role?.replace('_', ' ')}
              </div>
              <div className="mt-4 text-left space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user?.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user?.phone || 'Not set'}</p>
                <p className="flex items-center gap-2"><User className="w-4 h-4" /> {user?.totalDonations || 0} donations</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6">
              <h3 className="font-semibold mb-6">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone</label>
                  <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Street Address</label>
                  <input className="input-field" value={form.address.street} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City</label>
                    <input className="input-field" value={form.address.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">State</label>
                    <input className="input-field" value={form.address.state} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
                  </div>
                </div>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>

          {user?.role === 'restaurant' && (
            <div className="card p-6 mt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><FileCheck className="w-5 h-5 text-brand-600" /> Food Quality Certificate</h3>
              <p className="text-sm text-gray-600 mb-4">Upload your FSSAI certificate to build trust with donors</p>
              <div className="space-y-4">
                <CertificateDropZone certType="fssai" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
