/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bed, Star, ChevronLeft, ChevronRight, Ruler, Check, X, Shield, ArrowUpDown, Sparkles } from 'lucide-react';
import { Room } from '../types';

export const Rooms: React.FC = () => {
  const { rooms, setCurrentView, setSelectedRoomId } = useApp();
  
  // States to track active image index in card-level mini-sliders
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

  const handleRoomClick = (id: string) => {
    setSelectedRoomId(id);
    setCurrentView('room-detail');
  };

  const handleBookNowClick = (e: React.MouseEvent, type: string) => {
    e.stopPropagation(); // Avoid triggering room details click
    setCurrentView('book');
  };

  const handleNextImage = (e: React.MouseEvent, roomId: string, imagesLength: number) => {
    e.stopPropagation();
    setCardImageIndices((prev) => {
      const current = prev[roomId] || 0;
      return { ...prev, [roomId]: (current + 1) % imagesLength };
    });
  };

  const handlePrevImage = (e: React.MouseEvent, roomId: string, imagesLength: number) => {
    e.stopPropagation();
    setCardImageIndices((prev) => {
      const current = prev[roomId] || 0;
      return { ...prev, [roomId]: (current - 1 + imagesLength) % imagesLength };
    });
  };

  const filteredRooms = rooms;

  return (
    <div className="bg-transparent min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase rounded-full">
            Angels Living Styles
          </div>
          <h1 className="font-serif italic font-normal text-4xl sm:text-5xl text-[#3A2D4F] leading-tight">
            Premium Rooms & Sharing Formats
          </h1>
          <p className="text-[#6B5B8E] max-w-xl mx-auto text-sm leading-relaxed">
            Select your preferred level of privacy and comfort. Each room includes daily professional cleaning and premium access to all PG services.
          </p>
        </div>

        {/* Rooms Listing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredRooms.map((room) => {
              const activeImgIdx = cardImageIndices[room.id] || 0;
              const hasMultipleImages = room.images.length > 1;

              return (
                <div
                  key={room.id}
                  className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-4 sm:p-5 shadow-sm overflow-hidden flex flex-col sm:flex-row gap-6 group hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => handleRoomClick(room.id)}
                >
                  
                  {/* Left Side: Photo Slider / Gallery */}
                  <div className="relative w-full sm:w-64 h-56 sm:h-auto bg-slate-100 rounded-3xl flex-shrink-0 overflow-hidden shadow-inner">
                    <img
                      src={room.images[activeImgIdx]}
                      alt={`${room.type} Room Photo`}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Navigation buttons inside card image */}
                    {hasMultipleImages && (
                      <>
                        <button
                          id={`card-prev-${room.id}`}
                          onClick={(e) => handlePrevImage(e, room.id, room.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/35 hover:bg-black/50 text-white z-20 border border-white/10 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          id={`card-next-${room.id}`}
                          onClick={(e) => handleNextImage(e, room.id, room.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/35 hover:bg-black/50 text-white z-20 border border-white/10 transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Image indicator dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {room.images.map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${i === activeImgIdx ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>

                    {/* Float tags */}
                    <span className="absolute top-3 left-3 bg-[#4A3B5F] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow border border-white/10">
                      {room.type} Sharing
                    </span>

                    {room.ac && (
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#4A3B5F] border border-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                        AC Fitted
                      </span>
                    )}
                  </div>

                  {/* Right Side: Specifications Details */}
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-[#4A3B5F] bg-[#967BB6]/15 px-2.5 py-1 rounded-lg border border-[#967BB6]/25">
                          Rent: ₹{room.rent.toLocaleString('en-IN')}/m
                        </span>
                        <span className="text-[11px] text-[#6B5B8E] font-semibold">
                          Deposit: ₹{room.deposit.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#3A2D4F] group-hover:text-[#967BB6] transition-colors leading-tight">
                        Premium {room.type} Suite
                      </h3>

                      <p className="text-xs text-[#6B5B8E] leading-relaxed line-clamp-2">
                        {room.description}
                      </p>
                    </div>

                    {/* Specifications table */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] border-t border-white/40 pt-3 text-[#6B5B8E]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#967BB6]" />
                        <span>Beds: <strong>{room.availableBeds} Free</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#967BB6]" />
                        <span>Floor: <strong>Floor {room.floorNumber}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#967BB6]" />
                        <span>Room Size: <strong>{room.size}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#967BB6]" />
                        <span>Bathroom: <strong>Attached</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#967BB6]" />
                        <span>Private Balcony: <strong>{room.balcony ? 'Available ✓' : 'Shared Lounge Only'}</strong></span>
                      </div>
                    </div>

                    {/* Book Now & Learn More CTA Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        id={`room-detail-btn-${room.id}`}
                        onClick={() => handleRoomClick(room.id)}
                        className="flex-1 py-2.5 text-center bg-white/80 border border-[#967BB6]/30 text-[#4A3B5F] hover:bg-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                      >
                        View Details
                      </button>
                      <button
                        id={`room-book-btn-${room.id}`}
                        onClick={(e) => handleBookNowClick(e, room.type)}
                        className="flex-1 py-2.5 text-center bg-[#D4AF37] hover:bg-[#c49f2c] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                      >
                        Book Bed
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

      </div>
    </div>
  );
};
