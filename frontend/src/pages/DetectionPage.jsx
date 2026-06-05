import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Search, Download, AlertTriangle, Play, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function DetectionPage({ onOpenReportWithDetections }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultType, setResultType] = useState(''); // 'image' or 'video'
  const [counts, setCounts] = useState({ D00: 0, D10: 0, D20: 0, D40: 0, OTHER: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Stop camera when activeTab changes or component unmounts
  useEffect(() => {
    if (activeTab === 'upload') {
      stopWebcam();
    } else {
      startWebcam();
    }
    return () => stopWebcam();
  }, [activeTab]);

  const startWebcam = async () => {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      setError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan.');
      setActiveTab('upload');
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResultUrl('');
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setResultUrl('');
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();

      if (activeTab === 'upload') {
        if (!selectedFile) {
          setError('Silakan pilih atau unggah file gambar/video terlebih dahulu.');
          setLoading(false);
          return;
        }

        formData.append('file', selectedFile);

        if (selectedFile.type.startsWith('image/')) {
          setResultType('image');
          const response = await axios.post('/predict_image', formData);
          setCounts(response.data.counts);
          setResultUrl(response.data.result_image);
        } else if (selectedFile.type.startsWith('video/')) {
          setResultType('video');
          const response = await axios.post('/predict_video', formData);
          setCounts(response.data.counts);
          // Handled response error in predict_video endpoint returning path
          setResultUrl(response.data.result_video || response.data.result_videoz);
        } else {
          setError('Tipe file tidak didukung. Harap unggah gambar atau video.');
        }
      } else {
        // Webcam snapshot analysis
        if (!videoRef.current || !canvasRef.current) {
          setError('Kamera belum siap.');
          setLoading(false);
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Draw video frame onto canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob and upload
        canvas.toBlob(async (blob) => {
          if (!blob) {
            setError('Gagal menangkap gambar dari kamera.');
            setLoading(false);
            return;
          }

          const fileFromBlob = new File([blob], 'webcam_capture.jpg', { type: 'image/jpeg' });
          formData.append('file', fileFromBlob);
          setResultType('image');

          try {
            const response = await axios.post('/predict_image', formData);
            setCounts(response.data.counts);
            setResultUrl(response.data.result_image);
          } catch (err) {
            console.error(err);
            setError('Gagal memproses gambar dari kamera.');
          } finally {
            setLoading(false);
          }
        }, 'image/jpeg', 0.95);
        return; // Early return because callback handles loading state end
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi saat memproses analisis.');
    } finally {
      if (activeTab === 'upload') {
        setLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = resultType === 'video' ? 'annotated_result.mp4' : 'annotated_result.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotalCount = () => {
    return Object.values(counts).reduce((a, b) => a + b, 0);
  };

  const handleQuickReportClick = () => {
    const total = getTotalCount();
    if (total === 0) return;

    // Map counts keys to Indonesian label types
    const detectedTypes = [];
    if (counts.D00 > 0) detectedTypes.push('Longitudinal Crack');
    if (counts.D10 > 0) detectedTypes.push('Transverse Crack');
    if (counts.D20 > 0) detectedTypes.push('Alligator Crack');
    if (counts.D40 > 0) detectedTypes.push('Pothole');
    if (counts.OTHER > 0) detectedTypes.push('Lainnya');

    onOpenReportWithDetections({
      damageTypes: detectedTypes,
      description: `Laporan otomatis hasil deteksi AI AsphaltEye. Ditemukan total ${total} kerusakan jalan: ` +
        `Longitudinal Crack (${counts.D00}), Transverse Crack (${counts.D10}), ` +
        `Alligator Crack (${counts.D20}), Pothole (${counts.D40}), Lainnya (${counts.OTHER}).`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-12">
      <div className="text-left max-w-3xl mb-12">
        <h1 className="font-extrabold tracking-tight text-4xl text-slate-900 mb-3">Deteksi Kerusakan Jalan</h1>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Unggah foto atau gunakan webcam untuk mendeteksi jenis kerusakan aspal secara otomatis dengan AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <div className="flex bg-slate-50 border-b border-slate-200 px-6 py-3 justify-between items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all focus:outline-none ${
                    activeTab === 'upload' ? 'bg-white shadow-sm border border-slate-200 text-brand-blue' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Unggah File
                </button>
                <button
                  onClick={() => setActiveTab('webcam')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all focus:outline-none ${
                    activeTab === 'webcam' ? 'bg-white shadow-sm border border-slate-200 text-brand-blue' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Webcam Langsung
                </button>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || (activeTab === 'upload' && !selectedFile)}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue disabled:opacity-50 hover:bg-blue-600 text-white shadow-md text-xs font-bold rounded-lg transition-all focus:outline-none"
              >
                <Search className="w-3.5 h-3.5" />
                Mulai Analisis
              </button>
            </div>

            <div className="p-6 bg-slate-100/50 min-h-[350px] flex items-center justify-center relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-800">Sedang menganalisis permukaan jalan...</p>
                    <p className="text-xs text-slate-500 mt-1">Harap tunggu, model AI sedang mendeteksi kerusakan.</p>
                  </div>
                </div>
              )}

              {activeTab === 'upload' ? (
                <div className="w-full h-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                  />

                  {resultUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900 max-h-[500px] flex items-center justify-center">
                      {resultType === 'video' ? (
                        <video src={resultUrl} controls className="w-full max-h-[500px] object-contain" autoPlay />
                      ) : (
                        <img src={resultUrl} alt="Annotated Result" className="w-full max-h-[500px] object-contain" />
                      )}
                      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                        <span className="text-[10px] font-bold bg-white/90 text-slate-800 px-2.5 py-1.5 rounded border border-slate-200 shadow backdrop-blur flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-brand-blue" />
                          Hasil Teranotasi
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setResultUrl('');
                          setPreviewUrl('');
                          setSelectedFile(null);
                          setCounts({ D00: 0, D10: 0, D20: 0, D40: 0, OTHER: 0 });
                          if (fileInputRef.current) fileInputRef.current.value = '';
                          triggerFileSelect();
                        }}
                        className="absolute bottom-4 left-4 text-xs font-semibold bg-white/90 hover:bg-white hover:text-slate-900 px-3 py-1.5 border border-slate-300 text-slate-700 rounded backdrop-blur transition-all flex items-center gap-1.5 shadow"
                      >
                        <Upload className="w-3 h-3" />
                        Unggah File Lain
                      </button>
                    </div>
                  ) : previewUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 max-h-[500px] flex items-center justify-center">
                      {selectedFile && selectedFile.type.startsWith('video/') ? (
                        <video src={previewUrl} controls className="w-full max-h-[500px] object-contain" />
                      ) : (
                        <img src={previewUrl} alt="Preview" className="w-full max-h-[500px] object-contain" />
                      )}
                      <button 
                        onClick={triggerFileSelect}
                        className="absolute bottom-4 left-4 text-xs font-semibold bg-white/80 hover:bg-white hover:text-slate-900 px-3 py-1.5 border border-slate-300 text-slate-700 rounded backdrop-blur transition-all"
                      >
                        Ganti File
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={triggerFileSelect}
                      className="border-2 border-dashed border-slate-300 hover:border-brand-blue/50 bg-white hover:bg-slate-50/50 rounded-xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[300px]"
                    >
                      <Upload className="w-10 h-10 text-slate-400 mb-4" />
                      <p className="text-sm text-slate-700 font-medium mb-1">
                        Tarik & Lepas gambar atau video di sini
                      </p>
                      <p className="text-xs text-slate-500 mb-6">atau klik untuk memilih dari komputer Anda</p>
                      <div className="flex gap-2">
                        {['JPG', 'PNG', 'MP4', 'MOV'].map(f => (
                          <span key={f} className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded border border-slate-200">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-900 aspect-video flex items-center justify-center relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {resultUrl && (
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-20">
                      <img src={resultUrl} alt="Annotated Capture" className="w-full h-full object-contain" />
                      <button
                        onClick={() => setResultUrl('')}
                        className="absolute top-4 right-4 text-xs font-semibold bg-white/90 text-slate-800 px-3 py-1.5 border border-slate-200 rounded backdrop-blur transition-all shadow-sm"
                      >
                        Kembali ke Kamera
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-xl text-xs font-medium">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-2xl p-6 shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold tracking-tight text-lg text-slate-900">Hasil Deteksi</h2>
              {resultUrl && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded transition-all focus:outline-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  Ekspor
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { key: 'D00', label: 'Longitudinal Crack', color: 'bg-brand-blue' },
                { key: 'D10', label: 'Transverse Crack', color: 'bg-brand-orange' },
                { key: 'D20', label: 'Alligator Crack', color: 'bg-brand-yellow' },
                { key: 'D40', label: 'Pothole (Lubang)', color: 'bg-brand-green' },
                { key: 'OTHER', label: 'Kerusakan Lainnya', color: 'bg-slate-400' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-900">
                    {counts[item.key]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Deteksi</span>
              <span className="text-lg font-mono font-extrabold text-slate-900">
                {resultUrl ? getTotalCount() : '—'}
              </span>
            </div>

            {/* Quick Report Trigger */}
            {resultUrl && getTotalCount() > 0 && (
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                <p className="text-xs text-slate-600 leading-normal">
                  Kerusakan berhasil diidentifikasi. Kirim data analisis langsung ke instansi terkait untuk penanganan lebih lanjut.
                </p>
                <button
                  onClick={handleQuickReportClick}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg text-xs shadow-md transition-colors focus:outline-none"
                >
                  <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                  Laporkan Kerusakan Ini
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
