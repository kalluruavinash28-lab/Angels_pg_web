import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Star, Coffee, Soup, Cookie, Flame, ShieldCheck, Heart, Edit, Calendar } from 'lucide-react';

export const FoodMenuPage: React.FC = () => {
  const { foodMenu, todaysSpecial, permanentItems, isOwnerLoggedIn, setCurrentView } = useApp();

  // Get current day of the week (e.g. "Monday")
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Use today as default tab, fallback to Monday if not matching
  const initialTab = validDays.includes(todayName) ? todayName : 'Monday';
  const [selectedDayTab, setSelectedDayTab] = useState<string>(initialTab);

  const activeDayMenu = foodMenu.find(m => m.day === selectedDayTab) || foodMenu[0];

  return (
    <div className="bg-transparent min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase rounded-full">
            Angels Bistro
          </div>
          <h1 className="font-serif italic font-normal text-4xl sm:text-5xl text-[#3A2D4F] leading-tight">
            Weekly Digital Food Menu
          </h1>
          <p className="text-[#6B5B8E] max-w-xl mx-auto text-sm leading-relaxed">
            Savor delicious, highly nutritious, home-style meals prepared daily. We maintain high kitchen cleanliness and cater to South and North Indian cuisines.
          </p>
        </div>

        {/* Today's Special Banner Card */}
        <div className="bg-[#D4AF37] rounded-[40px] p-6 sm:p-8 text-[#4A3B5F] border border-white/20 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center gap-6 justify-between">
          
          {/* Subtle details background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4A3B5F] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              Today's Special Item
            </div>
            <h3 className="font-serif font-black text-2xl sm:text-3xl tracking-tight leading-none text-white">
              {todaysSpecial}
            </h3>
            <p className="text-xs text-[#4A3B5F] font-bold max-w-lg opacity-90">
              Prepared with high-quality ingredients, pure ghee, and low spices. Made fresh by our master culinary chefs today!
            </p>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto text-center">
            {isOwnerLoggedIn ? (
              <button
                id="menu-edit-shortcut"
                onClick={() => setCurrentView('admin')}
                className="w-full sm:w-auto px-5 py-3.5 bg-[#4A3B5F] hover:bg-[#3a2e4b] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Edit className="w-4 h-4 text-white" />
                Edit Menu & Special
              </button>
            ) : (
              <div className="bg-[#4A3B5F]/10 px-6 py-3 rounded-2xl border border-white/25 inline-block text-center">
                <span className="text-[9px] font-bold text-[#4A3B5F] uppercase tracking-widest block">Diet Preference</span>
                <span className="text-xs font-extrabold text-[#4A3B5F]">White & Red Rice Served</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Days Selector Tabs */}
        <div className="space-y-6">
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none snap-x justify-start md:justify-center">
            {validDays.map((day) => {
              const isToday = day === todayName;
              const isActive = day === selectedDayTab;

              return (
                <button
                  key={day}
                  id={`food-day-tab-${day}`}
                  onClick={() => setSelectedDayTab(day)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-1.5 snap-center border ${
                    isActive
                      ? 'bg-[#4A3B5F] text-white border-[#4A3B5F] shadow-sm scale-[1.02]'
                      : 'bg-white/40 text-[#4A3B5F] border-white/60 hover:bg-white/60'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {day}
                  {isToday && (
                    <span className="text-[9px] bg-[#D4AF37] text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase ml-1">
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Day Menu Details Block */}
          {activeDayMenu && (
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 sm:p-10 space-y-8 shadow-sm">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/40">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#967BB6] font-bold uppercase tracking-widest">Active Menu Viewer</span>
                  <h2 className="font-serif font-bold text-2xl text-[#3A2D4F]">
                    Sustenance Schedule for {activeDayMenu.day}
                  </h2>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Hygienically Cooked Checked
                </div>
              </div>

              {/* Grid of 5 Meals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                
                {/* 1. Breakfast */}
                <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-3xl p-5 space-y-4 hover:border-white/80 hover:bg-white/50 transition-all group shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wide bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                      Morning (7:30 - 10 AM)
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-sm text-[#3A2D4F] group-hover:text-[#967BB6] transition-colors">Breakfast Delight</h4>
                    <p className="text-xs text-[#6B5B8E] leading-relaxed min-h-[50px]">
                      {activeDayMenu.breakfast}
                    </p>
                  </div>
                </div>

                {/* 2. Lunch */}
                <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-3xl p-5 space-y-4 hover:border-white/80 hover:bg-white/50 transition-all group shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#967BB6]/15 text-[#967BB6] flex items-center justify-center">
                      <Soup className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] text-[#4A3B5F] font-bold uppercase tracking-wide bg-[#967BB6]/10 px-2 py-0.5 rounded">
                      Afternoon (12:30 - 2:30 PM)
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-sm text-[#3A2D4F] group-hover:text-[#967BB6] transition-colors">Nutritional Lunch</h4>
                    <p className="text-xs text-[#6B5B8E] leading-relaxed min-h-[50px]">
                      {activeDayMenu.lunch}
                    </p>
                  </div>
                </div>

                {/* 3. Snacks */}
                <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-3xl p-5 space-y-4 hover:border-white/80 hover:bg-white/50 transition-all group shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center">
                      <Cookie className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wide bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                      Snacks (5-6 PM)
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-sm text-[#3A2D4F] group-hover:text-[#967BB6] transition-colors">Evening Bites</h4>
                    <p className="text-xs text-[#6B5B8E] leading-relaxed min-h-[50px]">
                      {activeDayMenu.snacks}
                    </p>
                  </div>
                </div>

                {/* 4. Dinner */}
                <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-3xl p-5 space-y-4 hover:border-white/80 hover:bg-white/50 transition-all group shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#967BB6]/15 text-[#967BB6] flex items-center justify-center">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] text-[#4A3B5F] font-bold uppercase tracking-wide bg-[#967BB6]/10 px-2 py-0.5 rounded">
                      Night (7:30 PM Onwards)
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-sm text-[#3A2D4F] group-hover:text-[#967BB6] transition-colors">Cozy Dinner</h4>
                    <p className="text-xs text-[#6B5B8E] leading-relaxed min-h-[50px]">
                      {activeDayMenu.dinner}
                    </p>
                  </div>
                </div>

                {/* 5. Everyday Essentials (Permanent Menu) */}
                <div className="bg-[#967BB6]/10 backdrop-blur-md border border-[#967BB6]/30 rounded-3xl p-5 space-y-4 hover:border-[#967BB6]/50 hover:bg-[#967BB6]/15 transition-all group shadow-sm col-span-1 sm:col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#967BB6]/20 text-[#4A3B5F] flex items-center justify-center">
                      <Coffee className="w-5 h-5 text-[#4A3B5F]" />
                    </div>
                    <span className="text-[9px] text-white font-bold uppercase tracking-wide bg-[#4A3B5F]/85 px-2 py-0.5 rounded">
                      Everyday Permanent
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#3A2D4F] group-hover:text-[#967BB6] transition-colors">Everyday Essentials</h4>
                    <div className="space-y-1.5 pt-1">
                      {permanentItems.split(',').filter(Boolean).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#4A3B5F] font-bold leading-tight">
                          <span className="text-[#D4AF37] font-extrabold flex-shrink-0">•</span>
                          <span>{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Nutrition features footer */}
              <div className="pt-6 border-t border-white/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6B5B8E] font-semibold">
                <span className="flex items-center gap-1.5 text-[#6B5B8E]">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  Nutritionally balanced and high-protein recipes curated weekly.
                </span>
                <div className="flex items-center gap-3">
                  <span className="bg-[#967BB6]/10 text-[#4A3B5F] px-3 py-1 rounded-full border border-white/30 font-bold">White Rice served</span>
                  <span className="bg-[#D4AF37]/10 text-[#4A3B5F] px-3 py-1 rounded-full border border-white/30 font-bold">Healthy Red Rice served</span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
