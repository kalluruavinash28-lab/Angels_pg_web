import React from 'react';
import { useApp } from '../context/AppContext';
import * as LucideIcons from 'lucide-react';

export const Facilities: React.FC = () => {
  const { facilities } = useApp();

  // Helper to dynamically render Lucide icons with fallback
  const getIcon = (name: string) => {
    // Check if icon exists in Lucide
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) {
      return <IconComponent className="w-8 h-8 text-[#967BB6]" />;
    }
    // Fallback Icon
    return <LucideIcons.Sparkles className="w-8 h-8 text-[#967BB6]" />;
  };

  return (
    <div className="bg-transparent min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase rounded-full">
            Our Elite Services
          </div>
          <h1 className="font-serif italic font-normal text-4xl sm:text-5xl text-[#3A2D4F] leading-tight">
            Premium Amenities & Comforts
          </h1>
          <p className="text-[#6B5B8E] max-w-xl mx-auto text-sm leading-relaxed">
            We leave no stone unturned to provide a fully integrated, safe, and homely ecosystem so you can focus entirely on your academics and career.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 group hover:border-white/80"
            >
              <div className="flex justify-between items-start">
                {/* Icon wrapper */}
                <div className="w-14 h-14 rounded-2xl bg-[#967BB6]/10 backdrop-blur-sm border border-white/40 group-hover:bg-[#967BB6]/20 flex items-center justify-center transition-all duration-300">
                  {getIcon(fac.iconName)}
                </div>
                
                {/* Visual verified indicator */}
                <span className="text-[9px] text-[#967BB6] font-bold tracking-widest uppercase">
                  Verified Facility
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#3A2D4F] group-hover:text-[#967BB6] transition-colors leading-tight">
                  {fac.name}
                </h3>
                <p className="text-xs text-[#6B5B8E] leading-relaxed">
                  {fac.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Highlight Panel */}
        <div className="bg-[#4A3B5F] rounded-[40px] p-8 sm:p-10 text-white border border-white/10 shadow-sm flex flex-col sm:flex-row items-center gap-8 justify-between relative overflow-hidden">
          {/* Background overlay lights */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#D4AF37] border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <LucideIcons.ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              Safety is our Highest Mandate
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white leading-tight">
              Secured Exclusively for Ladies' Living
            </h3>
            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-sans">
              Our PG operates under stringent supervision: regular female wardens reside on-premise, biometric scanner locks restrict external visitors, fire-safety cylinders are installed, and instant power backup lines operate continuously. We ensure your absolute comfort and security.
            </p>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto text-center">
            <div className="inline-block bg-white/10 px-8 py-5 rounded-3xl border border-white/25 backdrop-blur-md shadow-sm">
              <span className="text-2xl font-black text-[#D4AF37] block">100%</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-200">Worry-Free Security</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
