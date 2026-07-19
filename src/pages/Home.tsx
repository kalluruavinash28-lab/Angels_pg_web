/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroSlider } from '../components/HeroSlider';
import { Shield, Sparkles, Utensils, Star, Phone, MessageSquare, Bed, Check, Heart } from 'lucide-react';

export const Home: React.FC = () => {
  const { rooms, setCurrentView, setSelectedRoomId, reviews } = useApp();

  const handleRoomClick = (id: string) => {
    setSelectedRoomId(id);
    setCurrentView('room-detail');
  };

  const activeRoomsPreview = rooms.slice(0, 3);

  const handleWhatsAppCall = (phone: string) => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent("Hello! I'm interested in rooms at Angels PG for Ladies.")}`, '_blank');
  };

  return (
    <div className="bg-transparent min-h-screen">
      {/* Hero Section */}
      <HeroSlider />

      {/* Triple Advantage Ribbon (Glass styled) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 relative z-20">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-center md:items-start text-center sm:text-left gap-4 p-4 rounded-2xl hover:bg-white/30 transition-all">
            <div className="w-14 h-14 rounded-full bg-[#967BB6]/10 backdrop-blur-sm border border-white/40 flex items-center justify-center text-[#4A3B5F] flex-shrink-0">
              <Shield className="w-6 h-6 text-[#967BB6]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-[#4A3B5F]">Safe Women's Living</h4>
              <p className="text-xs text-[#6B5B8E] mt-1 leading-relaxed">24/7 CCTV surveillance, biometric locks, and expert security guards.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center md:items-start text-center sm:text-left gap-4 p-4 rounded-2xl hover:bg-white/30 transition-all">
            <div className="w-14 h-14 rounded-full bg-[#967BB6]/10 backdrop-blur-sm border border-white/40 flex items-center justify-center text-[#4A3B5F] flex-shrink-0">
              <Utensils className="w-6 h-6 text-[#967BB6]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-[#4A3B5F]">Homely Food</h4>
              <p className="text-xs text-[#6B5B8E] mt-1 leading-relaxed">Hygienic daily South & North Indian menus. White & red rice options.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center md:items-start text-center sm:text-left gap-4 p-4 rounded-2xl hover:bg-white/30 transition-all">
            <div className="w-14 h-14 rounded-full bg-[#967BB6]/10 backdrop-blur-sm border border-white/40 flex items-center justify-center text-[#4A3B5F] flex-shrink-0">
              <Sparkles className="w-6 h-6 text-[#967BB6]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-[#4A3B5F]">Premium Amenities</h4>
              <p className="text-xs text-[#6B5B8E] mt-1 leading-relaxed">High-speed WiFi, solar hot water, elevator, and rooftop screening.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Available Rooms Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase rounded-full">
            Our Accommodations
          </div>
          <h2 className="font-serif italic font-normal text-4xl sm:text-5xl text-[#3A2D4F] leading-tight">
            Where Comfort Meets Safety
          </h2>
          <p className="text-[#6B5B8E] max-w-xl mx-auto text-sm leading-relaxed">
            Choose from multiple sharing formats meticulously structured for spacious breathing, study, and relaxing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeRoomsPreview.map((room) => (
            <div
              key={room.id}
              className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => handleRoomClick(room.id)}
            >
              {/* Thumbnail Container */}
              <div className="relative h-56 rounded-3xl overflow-hidden bg-slate-100 shadow-inner">
                <div className="absolute inset-0 bg-[#3A2D4F]/10 group-hover:bg-[#3A2D4F]/0 transition-all z-10" />
                <img
                  src={room.images[0]}
                  alt={`${room.type} Room`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float badges */}
                <span className="absolute top-4 left-4 bg-[#4A3B5F] text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm z-20">
                  {room.type} Sharing
                </span>
                
                <span className="absolute top-4 right-4 bg-[#D4AF37] text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm z-20 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white text-white" />
                  Premium
                </span>

                {room.ac && (
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#4A3B5F] border border-white font-bold text-[9px] px-2.5 py-1 rounded-full shadow-sm z-20 uppercase tracking-wider">
                    Air Conditioned
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="pt-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-[#6B5B8E] uppercase tracking-widest font-bold">Rent Monthly</span>
                    <span className="text-xl font-serif font-black text-[#4A3B5F]">₹{room.rent.toLocaleString('en-IN')}<span className="text-xs text-[#6B5B8E] font-normal font-sans"> / month</span></span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#3A2D4F] group-hover:text-[#967BB6] transition-colors leading-tight">
                    Premium {room.type} Room
                  </h3>
                  <p className="text-xs text-[#6B5B8E] line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                {/* Grid specs */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs border-t border-b border-white/40 py-3.5 text-[#6B5B8E]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#967BB6] font-bold">•</span>
                    <span>Beds: {room.availableBeds} Left</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#967BB6] font-bold">•</span>
                    <span>Floor: Level {room.floorNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#967BB6] font-bold">•</span>
                    <span>Washroom: Attached</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#967BB6] font-bold">•</span>
                    <span>Balcony: {room.balcony ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <button
                    id={`room-preview-btn-${room.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomClick(room.id);
                    }}
                    className="w-full py-3 bg-white/80 border border-[#967BB6]/30 text-[#4A3B5F] hover:bg-[#4A3B5F] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    View Details & Photos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-10">
          <button
            id="home-view-all-rooms"
            onClick={() => setCurrentView('rooms')}
            className="inline-flex items-center gap-1 px-8 py-4 bg-[#4A3B5F] hover:bg-[#3A2D4F] text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-sm transition-all"
          >
            Explore All Sharing Room Types
          </button>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#967BB6]/10">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase rounded-full">
            Happy Guests
          </div>
          <h2 className="font-serif italic font-normal text-4xl text-[#3A2D4F]">
            What Our Residents Say
          </h2>
          <p className="text-[#6B5B8E] max-w-xl mx-auto text-sm leading-relaxed">
            We offer cozy comfortable stays. Read true experiences from women professionals and students living at Angels PG.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((t, idx) => (
            <div
              key={t.id || idx}
              className="bg-white/60 backdrop-blur-xl rounded-[40px] p-8 border border-white/80 shadow-sm flex flex-col justify-between space-y-6 relative hover:scale-[1.01] transition-transform duration-300"
            >
              {/* Stars and text */}
              <div className="space-y-4">
                <div className="flex gap-1 text-[#D4AF37]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-xs text-[#4A3B5F] italic leading-relaxed font-serif">
                  "{t.text}"
                </p>
              </div>

              {/* Profile card */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#967BB6]/20">
                <img
                  src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#4A3B5F]">{t.name}</h4>
                  <p className="text-[10px] text-[#6B5B8E] font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Contact & WhatsApp CTA Panel */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4A3B5F] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-md flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Accent light decoration */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <h3 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Have Questions? Talk to Our PG Warden
            </h3>
            <p className="text-sm text-slate-200/90 leading-relaxed max-w-xl">
              Want a physical tour or need custom dietary arrangements? Our office is online 24/7. Text or call us directly on WhatsApp to clear your doubts!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-1 justify-center lg:justify-start">
              <a href="tel:8074494420" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-white">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                Call +91 8074494420
              </a>
              <a href="tel:7207174230" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-white">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                Call +91 7207174230
              </a>
            </div>
          </div>

          <div className="flex-shrink-0 w-full lg:w-auto text-center">
            <button
              id="home-whatsapp-quick"
              onClick={() => handleWhatsAppCall('918074494420')}
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 mx-auto"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              Direct WhatsApp chat
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
