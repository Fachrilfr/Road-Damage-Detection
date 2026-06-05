import React, { useState, useEffect } from 'react';
import { Search, MapPin, Eye, AlertCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Custom Marker Generator
const getMarkerIcon = (severity) => {
  let colorClass = 'bg-slate-500';
  if (severity === 'Parah') colorClass = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]';
  else if (severity === 'Sedang') colorClass = 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]';
  else if (severity === 'Ringan') colorClass = 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]';

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-4 h-4 rounded-full border-[2.5px] border-white ${colorClass}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export default function ReportsPage() {
  const [allReports, setAllReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeSeverity, setActiveSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchReports();
    
    const handleRefresh = () => fetchReports();
    window.addEventListener('refresh-reports', handleRefresh);
    return () => window.removeEventListener('refresh-reports', handleRefresh);
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/reports');
      const reports = response.data.reports || [];
      setAllReports(reports);
      setFilteredReports(reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...allReports];

    // Status Filter
    if (activeStatus !== 'all') {
      filtered = filtered.filter(
        r => (r.status || 'Dilaporkan').toLowerCase() === activeStatus.toLowerCase()
      );
    }

    // Severity Filter
    if (activeSeverity !== 'all') {
      filtered = filtered.filter(
        r => (r.severity || '').toLowerCase() === activeSeverity.toLowerCase()
      );
    }

    // Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          (r.location || '').toLowerCase().includes(query) ||
          (r.reporter_name || '').toLowerCase().includes(query) ||
          (r.id || '').toLowerCase().includes(query) ||
          (r.damage_types || []).some(t => t.toLowerCase().includes(query))
      );
    }

    setFilteredReports(filtered);
  }, [activeStatus, activeSeverity, searchQuery, allReports]);

  const timeAgo = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    return `${days} hari yang lalu`;
  };

  const getStats = () => {
    return {
      total: allReports.length,
      severe: allReports.filter(r => r.severity === 'Parah').length,
      processing: allReports.filter(r => r.status === 'Diproses').length,
      completed: allReports.filter(r => r.status === 'Selesai').length,
    };
  };

  const stats = getStats();

  const getSeverityStyles = (sev) => {
    switch (sev) {
      case 'Parah': return 'border-red-500/20 bg-red-50 text-red-600';
      case 'Sedang': return 'border-yellow-500/20 bg-yellow-50 text-yellow-600';
      case 'Ringan': return 'border-green-500/20 bg-green-50 text-green-600';
      default: return 'border-slate-200 bg-slate-50 text-slate-500';
    }
  };

  const getStatusStyles = (status) => {
    const s = status || 'Dilaporkan';
    switch (s) {
      case 'Selesai': return 'bg-green-50 text-green-700 border-green-200';
      case 'Diproses': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Dilaporkan':
      default: return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-12">
      {/* Header */}
      <div className="text-left max-w-3xl mb-12">
        <h1 className="font-extrabold tracking-tight text-4xl text-slate-900 mb-3">Aspirasi Kerusakan Jalan</h1>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Seluruh keluhan jalan rusak dari masyarakat disajikan secara transparan, real-time, dan terus dipantau penyelesaiannya oleh dinas terkait.
        </p>
      </div>

      {/* Summary statistics bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-6 rounded-2xl mb-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 shadow-sm">
        <div className="flex flex-col justify-center items-center md:items-start p-2">
          <span className="text-2xl font-mono font-extrabold text-slate-900">{stats.total}</span>
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Total Laporan</span>
        </div>
        <div className="flex flex-col justify-center items-center p-2 pt-4 md:pt-2">
          <span className="text-2xl font-mono font-extrabold text-red-500">{stats.severe}</span>
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Kritis / Parah</span>
        </div>
        <div className="flex flex-col justify-center items-center p-2 pt-4 md:pt-2">
          <span className="text-2xl font-mono font-extrabold text-brand-blue">{stats.processing}</span>
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Sedang Diproses</span>
        </div>
        <div className="flex flex-col justify-center items-center md:items-end p-2 pt-4 md:pt-2">
          <span className="text-2xl font-mono font-extrabold text-green-500">{stats.completed}</span>
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Selesai Diperbaiki</span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 border border-slate-200 rounded-xl mb-8 shadow-sm">
        
        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all focus:outline-none ${
              viewMode === 'grid' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all focus:outline-none ${
              viewMode === 'map' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Map
          </button>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'Dilaporkan', label: 'Dilaporkan' },
            { id: 'Diproses', label: 'Diproses' },
            { id: 'Selesai', label: 'Selesai' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveStatus(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all focus:outline-none ${
                activeStatus === opt.id
                  ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-md'
                  : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Severity filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1 md:flex-initial">
          <div className="flex gap-2">
            {[
              { id: 'Parah', label: '🔴 Parah' },
              { id: 'Sedang', label: '🟡 Sedang' },
              { id: 'Ringan', label: '🟢 Ringan' }
            ].map(opt => {
              const isActive = activeSeverity === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveSeverity(isActive ? 'all' : opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all focus:outline-none ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-md'
                      : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lokasi, jenis..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-brand-blue focus:bg-white rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Reports Grid / Map View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-slate-100 border border-slate-200 rounded-xl h-60 animate-pulse"></div>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-2xl mb-12">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="font-bold tracking-tight text-lg text-slate-700">Tidak Ada Laporan</h3>
          <p className="text-slate-500 text-xs mt-1">Coba sesuaikan filter status atau kata pencarian Anda.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden ${
                report.severity === 'Parah' ? 'border-red-200 hover:border-red-300' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* ID & Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-slate-400">#{report.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyles(report.status)}`}>
                    {report.status || 'Dilaporkan'}
                  </span>
                </div>

                {/* Photo Thumbnail */}
                {report.photo_url && (
                  <div className="w-full h-36 rounded-lg overflow-hidden mb-4 border border-slate-200">
                    <img
                      src={report.photo_url}
                      alt="Foto Bukti Kerusakan"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Location */}
                <h4 className="text-slate-900 font-bold text-sm flex items-start gap-1.5 mb-1.5">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>{report.location || 'Lokasi tidak teridentifikasi'}</span>
                </h4>

                {/* Reporter */}
                <p className="text-[11px] text-slate-500 font-medium mb-3">
                  Dilaporkan oleh: <span className="text-slate-700 font-semibold">{report.reporter_name || 'Anonim'}</span>
                </p>

                {/* Description */}
                {report.description && (
                  <p className="text-slate-600 text-xs leading-normal mb-4 italic line-clamp-2">
                    "{report.description}"
                  </p>
                )}

                {/* Damage Type Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(report.damage_types || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Info */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityStyles(report.severity)}`}>
                  {report.severity || '–'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {timeAgo(report.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'map' ? (
        <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0 mb-12">
          <MapContainer 
            center={[-2.5489, 118.0149]} 
            zoom={5} 
            scrollWheelZoom={true} 
            className="h-full w-full bg-slate-50"
          >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredReports.map(report => {
            if (!report.latitude || !report.longitude) return null;
            
            const lat = parseFloat(report.latitude);
            const lng = parseFloat(report.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker key={`map-${report.id}`} position={[lat, lng]} icon={getMarkerIcon(report.severity)}>
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]">
                    {report.photo_url && (
                      <img src={report.photo_url} alt="Rusak" className="w-full h-24 object-cover rounded mb-2 border border-slate-200" />
                    )}
                    <h4 className="font-bold text-sm mb-1 text-slate-900">{report.location}</h4>
                    <p className="text-xs text-slate-600 mb-2">Dilaporkan oleh: {report.reporter_name}</p>
                    
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        report.severity === 'Parah' ? 'bg-red-100 text-red-700' :
                        report.severity === 'Sedang' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>{report.severity}</span>
                      <span className="text-[10px] text-slate-500">{timeAgo(report.timestamp)}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      ) : null}

    </div>
  );
}
