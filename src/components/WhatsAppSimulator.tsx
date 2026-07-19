/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Check, CheckCheck, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const WhatsAppSimulator: React.FC = () => {
  const { recentNotification, clearNotification } = useApp();
  const [playBeep, setPlayBeep] = useState(false);

  useEffect(() => {
    if (recentNotification?.show) {
      setPlayBeep(true);
      const timer = setTimeout(() => {
        setPlayBeep(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [recentNotification]);

  if (!recentNotification || !recentNotification.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700 font-sans">
      
      {/* Sound Effect Visual Indicator (Benign) */}
      {playBeep && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse" />
      )}

      {/* Header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-slate-200 text-[#075E54] font-bold flex items-center justify-center relative">
            A
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div>
            <h4 className="font-semibold text-xs leading-none">Angels PG for Ladies</h4>
            <span className="text-[10px] text-emerald-200 font-medium">Auto WhatsApp Gateway</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded font-mono">SIMULATION</span>
          <button
            id="wa-sim-close"
            onClick={clearNotification}
            className="text-emerald-100 hover:text-white hover:bg-[#128C7E] p-1 rounded transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body simulating WhatsApp background chat */}
      <div 
        className="p-4 space-y-3 bg-[#E5DDD5] max-h-[280px] overflow-y-auto"
        style={{
          backgroundImage: 'radial-gradient(#dfdcd6 15%, transparent 16%)',
          backgroundSize: '16px 16px',
        }}
      >
        {/* Subtitle helper */}
        <div className="mx-auto text-center">
          <span className="inline-block bg-white/80 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
            TODAY
          </span>
        </div>

        {/* The message bubble */}
        <div className="flex justify-start max-w-[90%]">
          <div className="bg-white text-slate-800 rounded-lg p-3 shadow-md relative rounded-tl-none">
            <span className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent" />
            
            <p className="text-xs whitespace-pre-wrap leading-relaxed text-slate-800">
              {recentNotification.messageText}
            </p>
            
            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-sky-500"><CheckCheck className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        </div>

        {/* Destination alert bubble */}
        <div className="text-center">
          <p className="text-[10px] text-slate-500 font-medium bg-slate-100/90 rounded-lg py-1.5 px-3 inline-block shadow-sm">
            Sent to: <span className="font-bold text-slate-700">{recentNotification.whatsAppNumber}</span> ({recentNotification.customerName})
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 flex justify-between gap-2">
        <button
          id="wa-sim-copy"
          onClick={() => {
            navigator.clipboard.writeText(recentNotification.messageText);
            alert("WhatsApp confirmation message copied to clipboard!");
          }}
          className="text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-all border border-slate-700"
        >
          Copy Text
        </button>
        <button
          id="wa-sim-send-real"
          onClick={() => {
            let phone = recentNotification.whatsAppNumber.replace(/\D/g, '');
            if (phone.length === 10) {
              phone = '91' + phone;
            }
            const encodedText = encodeURIComponent(recentNotification.messageText);
            window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-all shadow-md flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-white" />
          Send (Real WA)
        </button>
        <button
          id="wa-sim-dismiss"
          onClick={clearNotification}
          className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-all"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
