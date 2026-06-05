import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DetectionPage from './pages/DetectionPage';
import ReportsPage from './pages/ReportsPage';
import ModalReport from './components/ModalReport';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [prefilledData, setPrefilledData] = useState(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleOpenReport = () => {
    setPrefilledData(null);
    setIsReportOpen(true);
  };

  const handleOpenReportWithDetections = (detections) => {
    setPrefilledData(detections);
    setIsReportOpen(true);
  };

  const handleReportSuccess = (reportId) => {
    showToast(`Laporan #${reportId} berhasil dikirim! Terima kasih atas partisipasi Anda.`);
    // If we're on the reports page, we might want to refresh it.
    // By re-loading reports, it triggers a refresh. We can do this by reloading window or state.
    if (activePage === 'reports') {
      // Small delay to allow JSON file to write and page component to fetch
      setTimeout(() => {
        window.dispatchEvent(new Event('refresh-reports'));
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-between relative overflow-x-hidden selection:bg-brand-blue/30 selection:text-white">
      {/* Background Noise and Overlays */}
      <div className="noise" />
      
      {/* Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenReport={handleOpenReport} 
      />

      {/* Main Pages Router */}
      <main className="flex-grow">
        {activePage === 'landing' && (
          <LandingPage 
            onStartDetect={() => setActivePage('detect')} 
            onOpenReport={handleOpenReport} 
          />
        )}
        {activePage === 'detect' && (
          <DetectionPage 
            onOpenReportWithDetections={handleOpenReportWithDetections} 
          />
        )}
        {activePage === 'reports' && (
          <ReportsPage />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Modal Report */}
      {isReportOpen && (
        <ModalReport 
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          onSuccess={handleReportSuccess}
          prefilledData={prefilledData} // We'll make ModalReport support prefilled data
        />
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-500">
          <div className={`glass px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border ${
            toast.type === 'success' ? 'border-brand-green/30 text-brand-green bg-dark-900/90' : 'border-brand-orange/30 text-brand-orange bg-dark-900/90'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <p className="text-xs font-semibold text-zinc-100 pr-4">{toast.message}</p>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
