/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ArrowLeft, Bed, Star, ShieldCheck, Ruler, Calendar, CheckCircle2, Flame, RefreshCcw, Bath, Compass, Wind } from 'lucide-react';

export const RoomDetail: React.FC = () => {
  const { rooms, selectedRoomId, setCurrentView, setSelectedRoomId } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Retrieve room
  const room = rooms.find(r => r.id === selectedRoomId);

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-violet-950">Room details could not be found</h3>
        <button
          onClick={() => {
            setSelectedRoomId(null);
            setCurrentView('rooms');
          }}
          className="px-6 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  const handleBookNow = () => {
    // Navigate to booking page
    setCurrentView('book');
  };

  return (
    <div className="bg-transparent min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button */}
        <button
          id="btn-back-to-rooms"
          onClick={() => {
            setSelectedRoomId(null);
            setCurrentView('rooms');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4A3B5F] hover:text-[#967BB6] bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Accommodations
        </button>

        {/* Main Grid: Details & Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Image Gallery (Span 7) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Large Display */}
            <div className="relative h-[320px] sm:h-[420px] rounded-[40px] overflow-hidden bg-slate-100 border border-white/60 shadow-sm group">
              <img
                src={room.images[activeImageIndex]}
                alt={`${room.type} Room Gallery`}
                className="w-full h-full object-cover object-center transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Bed Count */}
              <div className="absolute top-4 left-4 bg-[#4A3B5F]/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-white shadow-md z-10 flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  {room.availableBeds} beds available
                </span>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4 bg-[#D4AF37] text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md z-10">
                Floor {room.floorNumber}
              </div>
            </div>

            {/* Thumbnail Carousel Picker */}
            {room.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    id={`thumb-image-${i}`}
                    onClick={() => setActiveImageIndex(i)}
                    className={`h-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all relative ${
                      i === activeImageIndex
                        ? 'border-[#4A3B5F] ring-2 ring-[#4A3B5F]/10'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail indicator"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Complete Description */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#3A2D4F]">Room Overview</h3>
              <p className="text-xs text-[#6B5B8E] leading-relaxed font-sans whitespace-pre-wrap">
                {room.description}
              </p>

              <div className="pt-4 border-t border-white/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-[#967BB6]/10 backdrop-blur-sm border border-white/40 rounded-2xl text-[#4A3B5F]">
                  <Bath className="w-5 h-5 text-[#967BB6] flex-shrink-0" />
                  <div>
                    <span className="text-[9px] text-[#967BB6] font-bold uppercase tracking-wider block">WASHROOM</span>
                    <span className="text-xs font-bold">{room.attachedBathroom ? 'Attached' : 'Common'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#967BB6]/10 backdrop-blur-sm border border-white/40 rounded-2xl text-[#4A3B5F]">
                  <Compass className="w-5 h-5 text-[#967BB6] flex-shrink-0" />
                  <div>
                    <span className="text-[9px] text-[#967BB6] font-bold uppercase tracking-wider block">BALCONY</span>
                    <span className="text-xs font-bold">{room.balcony ? 'Private' : 'No Balcony'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#967BB6]/10 backdrop-blur-sm border border-white/40 rounded-2xl text-[#4A3B5F]">
                  <Wind className="w-5 h-5 text-[#967BB6] flex-shrink-0" />
                  <div>
                    <span className="text-[9px] text-[#967BB6] font-bold uppercase tracking-wider block">VENTILATION</span>
                    <span className="text-xs font-bold">{room.ac ? 'Air Conditioner' : 'Ceiling Fan'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Core Details & Booking CTA Card (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Core Rent details card */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[40px] shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-1">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest block">Premium Ladies Living</span>
                <h2 className="font-serif font-bold text-2xl text-[#3A2D4F]">
                  {room.type} Suite Bed
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#6B5B8E] font-semibold">
                  <span>Angels PG Shanthipura</span>
                  <span>•</span>
                  <span>Safety Verified</span>
                </div>
              </div>

              {/* Price & Deposit blocks */}
              <div className="p-5 bg-[#967BB6]/10 backdrop-blur-sm border border-white/40 rounded-3xl space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#6B5B8E] font-semibold">Monthly Rent (INR)</span>
                  <div className="text-right">
                    <span className="text-3xl font-serif font-black text-[#4A3B5F]">₹{room.rent.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-[#6B5B8E] block font-sans">per bed / occupant</span>
                  </div>
                </div>

                <div className="h-px bg-white/40" />

                <div className="flex justify-between items-center text-xs text-[#6B5B8E] font-semibold">
                  <span>Refundable Security Deposit:</span>
                  <span className="text-[#4A3B5F] font-bold font-serif">₹{room.deposit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Specs checklist */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-[#4A3B5F] uppercase tracking-widest">Key Specs</h4>
                <div className="grid grid-cols-2 gap-3 text-xs text-[#6B5B8E]">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#967BB6] flex-shrink-0" />
                    <span>Floor Level {room.floorNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#967BB6] flex-shrink-0" />
                    <span>Size: {room.size}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#967BB6] flex-shrink-0" />
                    <span>24/7 Hot Water</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#967BB6] flex-shrink-0" />
                    <span>Daily cleaning</span>
                  </div>
                </div>
              </div>

              {/* Book button */}
              <button
                id="btn-confirm-room-booking"
                onClick={handleBookNow}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#c49f2c] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-all text-center"
              >
                Proceed to Book Bed
              </button>

              <p className="text-[9px] text-center text-[#6B5B8E] leading-relaxed font-medium">
                🔒 Security Note: This booking is safe. Zero immediate payment is required. Your status will be reviewed and confirmed by our manager.
              </p>
            </div>

            {/* Custom Amenities list */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#3A2D4F] uppercase tracking-wider">Amenities Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-white/40 border border-white/60 rounded-2xl shadow-inner">
                    <div className="w-5 h-5 rounded-full bg-[#967BB6]/15 flex items-center justify-center text-[#967BB6] flex-shrink-0">
                      <Star className="w-3 h-3 fill-[#967BB6]" />
                    </div>
                    <span className="text-xs text-[#6B5B8E] font-bold">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
