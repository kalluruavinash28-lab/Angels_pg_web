/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, MessageSquare, ShieldCheck, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, isOwnerLoggedIn } = useApp();

  const handleWhatsAppClick = (phone: string) => {
    const text = encodeURIComponent("Hello Angels PG, I'm interested in booking a room. Could you please share more details?");
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-white/30 backdrop-blur-xl text-[#4A3B5F] pt-16 pb-8 border-t border-[#967BB6]/20 mt-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[#967BB6]/20">
          
          {/* Column 1: Info */}
          <div className="space-y-4">
            <div 
              onDoubleClick={() => setCurrentView('admin')}
              title="Double-click to access Warden Portal (Hidden)"
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#967BB6] flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-serif font-bold text-lg text-[#4A3B5F]">Angels PG for Ladies</span>
            </div>
            <p className="text-sm text-[#6B5B8E] leading-relaxed">
              Experience the pinnacle of premium ladies' PG living. We represent unmatched safety, wholesome hygienic meals, and upscale modern facilities located in Shanthipura, Bangalore.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-[#D4AF37] font-bold bg-[#967BB6]/10 p-3 rounded-xl border border-white/40 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
              <span>Biometric Entrance & 24/7 CCTV Safeguards Active</span>
            </div>
          </div>

          {/* Column 2: Quick Links & Contact */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-[#4A3B5F] text-base uppercase tracking-wider">Contact Details</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#967BB6] flex-shrink-0 mt-0.5" />
                <span className="text-[#6B5B8E]">
                  Angels PG for Ladies<br />
                  3rd Cross, Anand Reddy Layout,<br />
                  Shanthipura, Bangalore - 560100
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#967BB6] flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:8074494420" className="text-[#4A3B5F] hover:text-[#967BB6] font-medium transition-colors">+91 8074494420</a>
                  <a href="tel:7207174230" className="text-[#4A3B5F] hover:text-[#967BB6] font-medium transition-colors">+91 7207174230</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#967BB6] flex-shrink-0" />
                <span className="text-[#6B5B8E]">angelladiespg6@gmail.com</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                id="footer-wa-btn-1"
                onClick={() => handleWhatsAppClick('918074494420')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white rounded-xl text-xs font-bold shadow-sm transition-all scale-100 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                WhatsApp Principal
              </button>
              <button
                id="footer-wa-btn-2"
                onClick={() => handleWhatsAppClick('917207174230')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white rounded-xl text-xs font-bold shadow-sm transition-all scale-100 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                WhatsApp Office
              </button>
            </div>
          </div>

          {/* Column 3: Location Map */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-[#4A3B5F] text-base uppercase tracking-wider">Our Location</h3>
            <a
              href="https://www.google.com/maps/place/Angel's+Ladies+PG/@12.8485693,77.6794792,17z/data=!4m16!1m9!3m8!1s0x3bae6dad6dbf067f:0xa82eb99e30b57fcd!2sAngel's+Ladies+PG!8m2!3d12.8485693!4d77.6820541!9m1!1b1!16s%2Fg%2F11s7tq5py4!3m5!1s0x3bae6dad6dbf067f:0xa82eb99e30b57fcd!8m2!3d12.8485693!4d77.6820541!16s%2Fg%2F11s7tq5py4?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="block w-full h-44 rounded-2xl overflow-hidden border border-[#967BB6]/35 bg-gradient-to-br from-[#967BB6]/15 via-[#967BB6]/5 to-[#D4AF37]/5 hover:border-[#D4AF37] shadow-sm relative group transition-all duration-300"
            >
              {/* Artistic styled minimal map overlay with directions icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-white/20 backdrop-blur-[2px] group-hover:bg-[#4A3B5F]/5 transition-all">
                <MapPin className="w-10 h-10 text-[#4A3B5F] group-hover:text-[#967BB6] group-hover:scale-110 transition-transform duration-300 mb-2" />
                <span className="font-serif text-sm font-bold text-[#4A3B5F]">Angel's Ladies PG</span>
                <span className="text-[10px] text-[#6B5B8E] mt-0.5">3rd Cross, Anand Reddy Layout, Shanthipura</span>
                <span className="mt-3 px-3 py-1 bg-[#4A3B5F] text-white group-hover:bg-[#D4AF37] text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-sm transition-all">
                  Get Directions →
                </span>
              </div>
            </a>
            <div className="flex justify-between items-center text-xs text-[#6B5B8E]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#967BB6]" />
                Visiting Hours: 9 AM - 8 PM
              </span>
              <a
                href="https://www.google.com/maps/place/Angel's+Ladies+PG/@12.8485693,77.6794792,17z/data=!4m16!1m9!3m8!1s0x3bae6dad6dbf067f:0xa82eb99e30b57fcd!2sAngel's+Ladies+PG!8m2!3d12.8485693!4d77.6820541!9m1!1b1!16s%2Fg%2F11s7tq5py4!3m5!1s0x3bae6dad6dbf067f:0xa82eb99e30b57fcd!8m2!3d12.8485693!4d77.6820541!16s%2Fg%2F11s7tq5py4?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="text-[#D4AF37] hover:underline font-bold"
              >
                Open in Maps →
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6B5B8E]">
          <p>© 2026 Angels PG for Ladies. All Rights Reserved. Designed for premium living.</p>
          <div className="flex gap-4">
            <button id="foot-nav-rooms" onClick={() => setCurrentView('rooms')} className="hover:text-[#4A3B5F] transition-colors font-medium">View Rooms</button>
            <button id="foot-nav-fac" onClick={() => setCurrentView('facilities')} className="hover:text-[#4A3B5F] transition-colors font-medium">Facilities</button>
            <button id="foot-nav-food" onClick={() => setCurrentView('menu')} className="hover:text-[#4A3B5F] transition-colors font-medium">Weekly Food Menu</button>
            {isOwnerLoggedIn && (
              <button id="foot-nav-admin" onClick={() => setCurrentView('admin')} className="hover:text-[#D4AF37] transition-colors font-bold">Warden Portal</button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
