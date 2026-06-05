import React, { useState, useEffect } from 'react';
import { Menu, X, AlertTriangle, Play } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenReport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (activePage === 'landing') {
        const aboutEl = document.getElementById('about');
        const servicesEl = document.getElementById('services');
        const processEl = document.getElementById('process');
        
        let currentSection = 'home';
        const scrollPos = window.scrollY + 150; // offset for navbar

        if (processEl && scrollPos >= processEl.offsetTop) {
          currentSection = 'process';
        } else if (servicesEl && scrollPos >= servicesEl.offsetTop) {
          currentSection = 'services';
        } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
          currentSection = 'about';
        }

        setActiveSection(currentSection);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePage]);

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-200' : 'bg-white/90 backdrop-blur-sm py-5 border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => {
              handleNavClick('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <img 
              src="/static/logo.png" 
              alt="AsphaltEye Logo" 
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
              Asphalt<span className="text-brand-blue">Eye</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button 
              onClick={() => {
                handleNavClick('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-brand-blue transition-colors focus:outline-none ${activePage === 'landing' && activeSection === 'home' ? 'text-brand-blue font-semibold' : ''}`}
            >
              Beranda
            </button>
            <button 
              onClick={() => {
                setActivePage('landing');
                setTimeout(() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`hover:text-brand-blue transition-colors focus:outline-none ${activePage === 'landing' && activeSection === 'about' ? 'text-brand-blue font-semibold' : ''}`}
            >
              Tentang
            </button>
            <button 
              onClick={() => {
                setActivePage('landing');
                setTimeout(() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`hover:text-brand-blue transition-colors focus:outline-none ${activePage === 'landing' && activeSection === 'services' ? 'text-brand-blue font-semibold' : ''}`}
            >
              Layanan Kami
            </button>
            <button 
              onClick={() => handleNavClick('reports')}
              className={`hover:text-brand-blue transition-colors focus:outline-none ${activePage === 'reports' ? 'text-brand-blue font-semibold' : ''}`}
            >
              Laporan Warga
            </button>
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onOpenReport}
              className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-full transition-all focus:outline-none shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-brand-orange" />
              Laporkan Kerusakan
            </button>
            
            <button 
              onClick={() => handleNavClick('detect')}
              className="flex items-center gap-1.5 text-xs font-semibold bg-brand-blue hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 px-5 py-2 rounded-full transition-all duration-300 focus:outline-none"
            >
              Mulai Deteksi
              <Play className="w-3.5 h-3.5 fill-white" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-600 hover:text-brand-blue focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-lg flex flex-col justify-center px-8 transition-all duration-300 md:hidden ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col gap-6 text-2xl font-semibold text-slate-600">
          <button 
            onClick={() => {
              handleNavClick('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`text-left hover:text-brand-blue focus:outline-none ${activePage === 'landing' && activeSection === 'home' ? 'text-brand-blue font-bold' : ''}`}
          >
            Beranda
          </button>
          <button 
            onClick={() => {
              handleNavClick('landing');
              setTimeout(() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`text-left hover:text-brand-blue focus:outline-none ${activePage === 'landing' && activeSection === 'about' ? 'text-brand-blue font-bold' : ''}`}
          >
            Tentang
          </button>
          <button 
            onClick={() => {
              handleNavClick('landing');
              setTimeout(() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`text-left hover:text-brand-blue focus:outline-none ${activePage === 'landing' && activeSection === 'services' ? 'text-brand-blue font-bold' : ''}`}
          >
            Layanan Kami
          </button>
          <button 
            onClick={() => handleNavClick('reports')}
            className={`text-left hover:text-brand-blue focus:outline-none ${activePage === 'reports' ? 'text-brand-blue font-bold' : ''}`}
          >
            Laporan Warga
          </button>
          <div className="h-px bg-slate-200 my-4" />
          <button 
            onClick={() => {
              setIsOpen(false);
              onOpenReport();
            }}
            className="flex items-center gap-2 text-lg text-brand-orange focus:outline-none"
          >
            <AlertTriangle className="w-5 h-5" />
            Laporkan Kerusakan
          </button>
          <button 
            onClick={() => handleNavClick('detect')}
            className="w-full text-center bg-brand-blue hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold py-3 rounded-full text-lg mt-4 focus:outline-none"
          >
            Mulai Deteksi →
          </button>
        </div>
      </div>
    </>
  );
}
