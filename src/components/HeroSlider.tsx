/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, ShieldCheck, Heart, Sparkles, Calendar, ArrowRight } from 'lucide-react';

const SLIDE_IMAGES = [
  {
    url: '/src/assets/images/pg_lobby_luxury_1784463583513.jpg',
    title: 'Welcome to Angels PG',
    subtitle: 'Where Premium Luxury Meets Homely Comfort',
    badge: "Safest Women's PG in Shanthipura"
  },
  {
    url: '/src/assets/images/pg_cafeteria_food_1784463622233.jpg',
    title: 'Hygienic Home Cooked Meals',
    subtitle: 'Nutritious & Wholesome South & North Indian Menu',
    badge: 'White & Red Rice Options Available'
  },
  {
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80',
    title: 'Exquisite Designed Rooms',
    subtitle: 'Single, Double, Triple and Four Sharing Options',
    badge: 'Fitted with Premium AC & Balconies'
  }
];

export const HeroSlider: React.FC = () => {
  const { setCurrentView } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDE_IMAGES.length) % SLIDE_IMAGES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] overflow-hidden bg-violet-950">
      
      {/* Background Slides */}
      {SLIDE_IMAGES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[1.05] z-0'
          }`}
        >
          {/* Visual gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/90 via-violet-900/75 to-transparent z-10" />
          <img
            src={slide.url}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
      ))}

      {/* Hero Content (Floating on top, locked in center z-20) */}
      <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl text-left space-y-6">
          
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/25 border border-amber-400 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm animate-bounce">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            {SLIDE_IMAGES[currentSlide].badge}
          </div>

          <div className="space-y-2.5">
            <h1 className="font-sans font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              Angels PG <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">for Ladies</span>
            </h1>
            <p className="text-lg sm:text-xl text-violet-100 font-medium tracking-wide">
              Safe Living • Homely Food • Premium Facilities
            </p>
          </div>

          <p className="text-sm sm:text-base text-violet-200/90 leading-relaxed font-sans max-w-xl">
            {SLIDE_IMAGES[currentSlide].subtitle}. Live in a boutique, beautifully designed space designed exclusively for dynamic students and female working professionals.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-book-now"
              onClick={() => setCurrentView('book')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-violet-950 font-bold text-base rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 scale-100 hover:scale-[1.02]"
            >
              Book Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              id="hero-view-rooms"
              onClick={() => setCurrentView('rooms')}
              className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-base rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              View Rooms
            </button>
          </div>

          {/* Core assurances indicators */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
            <div className="flex items-center gap-2 text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold">24/7 Guards</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold">Homely Meals</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold">Superb WiFi</span>
            </div>
          </div>

        </div>
      </div>

      {/* Slide Navigation Buttons */}
      <button
        id="hero-prev-slide"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/25 hover:bg-black/40 text-white border border-white/10 transition-all"
        title="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        id="hero-next-slide"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/25 hover:bg-black/40 text-white border border-white/10 transition-all"
        title="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDE_IMAGES.map((_, index) => (
          <button
            key={index}
            id={`hero-dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-amber-500 w-8' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
