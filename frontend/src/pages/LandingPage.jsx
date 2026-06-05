import React from 'react';
import { Search, MonitorPlay, AlertTriangle, ShieldCheck, Map, Activity, CheckCircle, Smartphone, Camera } from 'lucide-react';

export default function LandingPage({ onStartDetect, onOpenReport }) {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/public/jalan.jpg"
            alt="Road background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-2xl">
            <span className="text-blue-300 font-semibold tracking-wide uppercase text-sm mb-4 block">
              Experience The Best Road AI Solutions
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Where AI Meets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-300">Infrastructure Safety</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
              AsphaltEye menggunakan computer vision berbasis YOLOv11 untuk mendeteksi retakan jalan, lubang, dan kerusakan aspal secara instan dalam hitungan detik.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onStartDetect}
                className="bg-brand-blue hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-brand-blue/30"
              >
                Mulai Deteksi <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white hover:text-blue-200 font-medium px-6 py-4 underline-offset-4 hover:underline transition-all"
              >
                Lihat Layanan Kami
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-brand-blue text-white py-4 overflow-hidden relative flex">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 px-4 text-sm font-semibold uppercase tracking-wider">
          <span>* Deteksi Retakan</span>
          <span>* Pelaporan Otomatis</span>
          <span>* Visualisasi Peta GPS</span>
          <span>* Keamanan Infrastruktur</span>
          <span>* Deteksi Retakan</span>
          <span>* Pelaporan Otomatis</span>
          <span>* Visualisasi Peta GPS</span>
          <span>* Keamanan Infrastruktur</span>
          <span>* Deteksi Retakan</span>
          <span>* Pelaporan Otomatis</span>
          <span>* Visualisasi Peta GPS</span>
          <span>* Keamanan Infrastruktur</span>
        </div>
      </div>

      {/* ABOUT US SECTION */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Grid Images */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="bg-slate-200 aspect-[4/5] rounded-3xl rounded-tr-none overflow-hidden relative border-8 border-brand-light">
                <img src="/public/pothole.jpg" alt="Road Inspection" className="w-full h-full object-cover" />
              </div>
              <div className="bg-slate-200 aspect-square rounded-3xl rounded-br-none overflow-hidden">
                <img src="/public/aligator.jpg" alt="Asphalt" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="bg-slate-200 aspect-[4/5] rounded-3xl rounded-tl-none overflow-hidden">
                <img src="/public/transverse.jpg" alt="AI Vision" className="w-full h-full object-cover" />
              </div>
              <div className="bg-slate-200 aspect-square rounded-3xl rounded-bl-none overflow-hidden">
                <img src="/public/longcrack.jpg" alt="City Road" className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Center Blue Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-brand-blue rounded-full border-4 border-white flex flex-col items-center justify-center text-white shadow-xl z-10">
              <span className="text-xl font-bold">100%</span>
              <span className="text-[10px] uppercase font-semibold text-blue-100">AI Based</span>
            </div>
          </div>

          {/* Right Text */}
          <div className="text-left">
            <span className="text-brand-blue font-semibold text-sm mb-4 block uppercase tracking-wider">About Us</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Transforming <span className="text-brand-blue font-light">Roads</span><br />
              into Safer Reality
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              AsphaltEye dikembangkan untuk mendemokratisasi pemantauan kualitas jalan raya. Siapa pun, mulai dari pengguna jalan raya biasa hingga dinas pekerjaan umum, dapat dengan cepat memetakan kerusakan jalan tanpa peralatan mahal.
              <br /><br />
              Dengan model machine learning computer vision terlatih, sistem ini mampu mereduksi waktu pelaporan kerusakan jalan secara signifikan dari hitungan minggu menjadi hitungan detik. Kami berdedikasi untuk menciptakan infrastruktur yang lebih aman dan tahan lama bagi seluruh pengguna jalan.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-brand-blue font-semibold text-sm mb-4 block uppercase tracking-wider">Our Services</span>
              <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                Services We Provide to <br />
                <span className="text-brand-blue font-light">Elevate Safety</span>
              </h2>
            </div>
            <button
              onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-brand-blue text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors shadow-md"
            >
              Lihat Proses Kerja
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MonitorPlay className="w-6 h-6 text-white" />, title: 'Deteksi Otomatis AI', desc: 'Sistem mengenali berbagai jenis retakan dan lubang secara real-time via gambar maupun video menggunakan YOLOv11.' },
              { icon: <Map className="w-6 h-6 text-white" />, title: 'Pemetaan Lokasi GPS', desc: 'Setiap deteksi dapat disambungkan dengan titik koordinat presisi tinggi pada peta interaktif berbasis Leaflet.' },
              { icon: <Smartphone className="w-6 h-6 text-white" />, title: 'Dashboard Pelaporan', desc: 'Menyediakan platform transparan untuk memantau status perbaikan jalan oleh instansi terkait secara live.' },
            ].map((srv, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 flex flex-col items-start group">
                <div className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-brand-blue/30 group-hover:-translate-y-1 transition-transform">
                  {srv.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{srv.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                  {srv.desc}
                </p>
                <button onClick={onStartDetect} className="text-brand-blue font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Mulai Deteksi <span className="text-lg">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section id="process" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-blue font-semibold text-sm mb-4 block uppercase tracking-wider">Our Work Process</span>
            <h2 className="text-4xl font-extrabold text-slate-900">
              Our Proven <span className="text-brand-blue font-light">Work Process</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-slate-200 -z-10"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { num: '01', icon: <Camera className="w-5 h-5 text-white" />, title: 'Pengambilan Media', desc: 'Ambil foto atau video kerusakan jalan.' },
                { num: '02', icon: <Activity className="w-5 h-5 text-white" />, title: 'Proses AI', desc: 'Model YOLOv11 menganalisis kerusakan secara instan.' },
                { num: '03', icon: <CheckCircle className="w-5 h-5 text-white" />, title: 'Validasi', desc: 'Tinjau hasil klasifikasi dan titik kordinat.' },
                { num: '04', icon: <AlertTriangle className="w-5 h-5 text-white" />, title: 'Pelaporan Resmi', desc: 'Laporan otomatis dikirim ke dinas terkait.' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center shadow-lg shadow-brand-blue/30 group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
