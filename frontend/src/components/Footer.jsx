import React from 'react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-brand-navy text-slate-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/static/logo.png" 
            alt="AsphaltEye Logo" 
            className="w-7 h-7 object-contain" 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="font-bold tracking-tight text-lg text-white">
            Asphalt<span className="text-blue-400">Eye</span>
          </span>
        </div>

        {/* Copy */}
        <p className="text-xs text-blue-300 text-center md:text-right">
          © 2026 AsphaltEye · Dibuat dengan Computer Vision untuk Infrastruktur Indonesia
        </p>
      </div>
    </footer>
  );
}
