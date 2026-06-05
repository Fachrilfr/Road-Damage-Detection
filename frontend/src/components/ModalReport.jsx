import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, MapPin, ClipboardList, Eye, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function ModalReport({ isOpen, onClose, onSuccess, prefilledData }) {
  const [formData, setFormData] = useState({
    reporter_name: '',
    location: '',
    latitude: '',
    longitude: '',
    severity: '',
    description: '',
  });
  
  const [selectedDamageTypes, setSelectedDamageTypes] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && prefilledData) {
      setSelectedDamageTypes(prefilledData.damageTypes || []);
      setFormData(prev => ({
        ...prev,
        description: prefilledData.description || '',
      }));
    }
  }, [isOpen, prefilledData]);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const damageOptions = [
    { label: 'Longitudinal Crack', color: 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' },
    { label: 'Transverse Crack', color: 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' },
    { label: 'Alligator Crack', color: 'bg-brand-yellow/10 border-brand-yellow/30 text-yellow-600' },
    { label: 'Pothole', color: 'bg-brand-green/10 border-brand-green/30 text-brand-green' },
    { label: 'Lainnya', color: 'bg-slate-100 border-slate-200 text-slate-600' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDamageChipToggle = (type) => {
    setSelectedDamageTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const grabGps = () => {
    if (!navigator.geolocation) {
      setError('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }
    setGpsLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setGpsLoading(false);
      },
      (err) => {
        setError('Gagal mendapatkan lokasi GPS. Pastikan izin lokasi aktif.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.reporter_name.trim()) return setError('Nama pelapor wajib diisi.');
    if (!formData.location.trim()) return setError('Lokasi wajib diisi.');
    if (selectedDamageTypes.length === 0) return setError('Pilih minimal satu jenis kerusakan.');
    if (!formData.severity) return setError('Pilih tingkat keparahan.');

    setLoading(true);

    try {
      const data = new FormData();
      data.append('reporter_name', formData.reporter_name);
      data.append('location', formData.location);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      data.append('severity', formData.severity);
      data.append('description', formData.description);
      data.append('damage_types', selectedDamageTypes.join(', '));
      
      if (photoFile) {
        data.append('photo', photoFile);
      }

      const response = await axios.post('/submit_report', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        onSuccess(response.data.report_id);
        onClose();
        // Reset form
        setFormData({
          reporter_name: '',
          location: '',
          latitude: '',
          longitude: '',
          severity: '',
          description: '',
        });
        setSelectedDamageTypes([]);
        setPhotoFile(null);
        setPhotoPreview('');
      } else {
        setError(response.data.error || 'Terjadi kesalahan saat mengirim laporan.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl relative my-8 border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <ClipboardList className="w-5 h-5 text-brand-blue" />
            <span>Lapor Kerusakan Jalan</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Reporter Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Nama Pelapor <span className="text-brand-orange">*</span>
            </label>
            <input 
              type="text" 
              name="reporter_name"
              value={formData.reporter_name}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap Anda"
              className="bg-white border border-slate-300 focus:border-brand-blue rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition-colors shadow-sm"
              required
            />
          </div>

          {/* Location & GPS */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Lokasi Kerusakan <span className="text-brand-orange">*</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Nama jalan / kelurahan / kota"
                className="flex-1 bg-white border border-slate-300 focus:border-brand-blue rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition-colors shadow-sm"
                required
              />
              <button 
                type="button"
                onClick={grabGps}
                disabled={gpsLoading}
                className="flex items-center gap-1 bg-slate-50 border border-slate-300 hover:border-brand-blue disabled:opacity-50 text-slate-700 px-3 rounded-lg text-xs font-semibold focus:outline-none transition-all shadow-sm"
              >
                <MapPin className={`w-3.5 h-3.5 text-brand-orange ${gpsLoading ? 'animate-bounce' : ''}`} />
                {gpsLoading ? 'Mencari...' : 'GPS'}
              </button>
            </div>
            
            <div className="flex gap-2 mt-1">
              <input 
                type="text" 
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Latitude (Misal: -6.2088)"
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-brand-blue rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-700 focus:outline-none transition-colors"
              />
              <input 
                type="text" 
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Longitude (Misal: 106.8456)"
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-brand-blue rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-700 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Damage Chips */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Jenis Kerusakan <span className="text-brand-orange">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {damageOptions.map((opt) => {
                const selected = selectedDamageTypes.includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleDamageChipToggle(opt.label)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all focus:outline-none ${
                      selected 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : opt.color
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Tingkat Keparahan <span className="text-brand-orange">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'Ringan', label: '🟢 Ringan', classes: 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100' },
                { val: 'Sedang', label: '🟡 Sedang', classes: 'border-yellow-200 text-yellow-700 bg-yellow-50 hover:bg-yellow-100' },
                { val: 'Parah', label: '🔴 Parah', classes: 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100' }
              ].map((opt) => {
                const isSelected = formData.severity === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, severity: opt.val }))}
                    className={`py-2 rounded-lg border text-xs font-bold text-center transition-all focus:outline-none shadow-sm ${
                      isSelected 
                        ? 'border-slate-900 bg-slate-900 text-white' 
                        : opt.classes
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Drag & Drop / Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Foto Kerusakan</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-slate-300 hover:border-brand-blue bg-slate-50 hover:bg-slate-100 rounded-xl p-6 text-center cursor-pointer transition-colors"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                accept="image/*"
                className="hidden"
              />
              {photoPreview ? (
                <div className="relative group max-h-40 overflow-hidden rounded-lg mx-auto w-32 border border-slate-200 shadow-sm">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <p className="text-xs font-medium text-slate-500">Klik untuk mengunggah foto kerusakan</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Keterangan Tambahan</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Jelaskan detail kerusakan (seberapa lebar, bahaya, dll.)"
              className="bg-white border border-slate-300 focus:border-brand-blue rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none transition-colors shadow-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button 
              type="button" 
              onClick={onClose}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 border border-transparent rounded-lg transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white shadow-md text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors focus:outline-none"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengirim...
                </>
              ) : (
                'Kirim Laporan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
