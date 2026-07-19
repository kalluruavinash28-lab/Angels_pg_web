/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Shield, Lock, LogOut, Home, Bed, Sparkles, Utensils, Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, isOwnerLoggedIn, logoutOwner } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { view: 'home', label: 'Home', icon: Home },
    { view: 'rooms', label: 'Rooms', icon: Bed },
    { view: 'facilities', label: 'Facilities', icon: Sparkles },
    { view: 'menu', label: 'Food Menu', icon: Utensils },
    { view: 'book', label: 'Book Now', icon: Calendar },
  ] as const;

  const handleNavClick = (view: typeof currentView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-xl border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            onDoubleClick={() => handleNavClick('admin')}
            title="Double-click to access Warden Portal (Hidden)"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#967BB6] flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm">
              <Shield className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-2xl text-[#4A3B5F] tracking-tight">Angels PG</span>
                <span className="text-[8px] sm:text-[10px] text-[#D4AF37] font-sans font-black tracking-widest uppercase">FOR LADIES</span>
              </div>
              <p className="text-[8px] sm:text-[9px] text-[#6B5B8E] font-semibold tracking-widest uppercase">Premium Living Space</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view || (item.view === 'rooms' && currentView === 'room-detail');
              return (
                <button
                  key={item.view}
                  id={`nav-link-${item.view}`}
                  onClick={() => handleNavClick(item.view)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-[#4A3B5F] text-white shadow-md shadow-[#4A3B5F]/20 scale-[1.02]'
                      : 'text-[#4A3B5F]/75 hover:text-[#967BB6] hover:bg-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isOwnerLoggedIn && (
              <div className="flex items-center gap-2">
                <button
                  id="header-btn-admin-panel"
                  onClick={() => handleNavClick('admin')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-300 flex items-center gap-1.5 ${
                    currentView === 'admin'
                      ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                      : 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Warden Portal
                </button>
                <button
                  id="header-btn-logout"
                  onClick={() => {
                    logoutOwner();
                    setCurrentView('home');
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            {isOwnerLoggedIn && (
              <button
                id="header-mobile-admin"
                onClick={() => handleNavClick('admin')}
                className={`p-2 rounded-lg border ${currentView === 'admin' ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]' : 'border-[#967BB6]/30 text-[#4A3B5F]'}`}
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#4A3B5F] hover:bg-white/40 rounded-xl transition-all border border-[#967BB6]/20"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-lg border-b border-white/50 px-4 pt-2 pb-6 space-y-2 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view || (item.view === 'rooms' && currentView === 'room-detail');
            return (
              <button
                key={item.view}
                id={`mobile-nav-link-${item.view}`}
                onClick={() => handleNavClick(item.view)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#4A3B5F] text-white shadow-sm'
                    : 'text-[#4A3B5F]/80 hover:bg-white/40'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-white/40 flex flex-col gap-2">
            {isOwnerLoggedIn && (
              <>
                <button
                  id="mobile-nav-admin"
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#D4AF37] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  Warden Portal
                </button>
                <button
                  id="mobile-nav-logout"
                  onClick={() => {
                    logoutOwner();
                    setCurrentView('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-rose-200 text-rose-600 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
