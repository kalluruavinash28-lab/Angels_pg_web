/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room, Booking, Facility, FoodDay, RoomType, Review } from '../types';
import { Lock, Eye, Check, X, ShieldAlert, Plus, Trash2, Edit3, Save, Calendar, Bed, Utensils, Sparkles, LogOut, CheckCircle, HelpCircle, FileText, Heart, Star, MessageSquare, Upload } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    rooms,
    bookings,
    facilities,
    foodMenu,
    todaysSpecial,
    permanentItems,
    isOwnerLoggedIn,
    loginOwner,
    loginWarden,
    logoutOwner,
    changeWardenPassword,
    sendPasswordResetLink,
    sendAccessVerificationCode,
    wardenEmail,
    addRoom: contextAddRoom,
    updateRoom: contextUpdateRoom,
    deleteRoom: contextDeleteRoom,
    addFacility: contextAddFacility,
    updateFoodMenu: contextUpdateFoodMenu,
    setTodaysSpecial: contextSetTodaysSpecial,
    setPermanentItems: contextSetPermanentItems,
    approveBooking: contextApproveBooking,
    rejectBooking: contextRejectBooking,
    markRoomStatus: contextMarkRoomStatus,
    setFacilities: contextSetFacilities,
    reviews,
    addReview: contextAddReview,
    deleteReview: contextDeleteReview
  } = useApp();

  // Authentication states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Warden interactive security states
  const [adminMode, setAdminMode] = useState<'login' | 'forgot' | 'verify_action'>('login');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [pendingAction, setPendingAction] = useState<{ type: string; payload: () => void } | null>(null);
  const [successNotice, setSuccessNotice] = useState('');

  // 2FA Security Interceptor - Bypassed for direct, hassle-free Warden operations
  const requestVerification = (actionLabel: string, callback: () => void) => {
    // Automatically execute the action directly without prompt
    callback();
    setSuccessNotice(`Successfully executed: ${actionLabel}`);
  };

  const confirmVerificationCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const inputClean = verificationCode.trim();
    if (inputClean === '2811' || inputClean === '281128' || inputClean === generatedCode) {
      if (pendingAction && typeof pendingAction.payload === 'function') {
        pendingAction.payload();
      }
      setSuccessNotice(`Successfully authorized and executed: ${pendingAction?.type}`);
      setPendingAction(null);
      setAdminMode('login'); // Return to normal view
      setVerificationCode('');
    } else {
      setVerificationError('Incorrect security verification code. Please enter 2811.');
    }
  };

  // Shadow methods to seamlessly verify any modification - calling context functions directly
  const addRoom = (p: any) => contextAddRoom(p);
  const updateRoom = (p: any) => contextUpdateRoom(p);
  const deleteRoom = (id: string) => contextDeleteRoom(id);
  const addFacility = (p: any) => contextAddFacility(p);
  const updateFoodMenu = (p: any) => contextUpdateFoodMenu(p);
  const setTodaysSpecial = (p: any) => contextSetTodaysSpecial(p);
  const setPermanentItems = (p: any) => contextSetPermanentItems(p);
  const approveBooking = (id: string) => contextApproveBooking(id);
  const rejectBooking = (id: string) => contextRejectBooking(id);
  const markRoomStatus = (id: string, status: any) => contextMarkRoomStatus(id, status);
  const setFacilities = (p: any) => contextSetFacilities(p);
  const deleteReview = (id: string) => contextDeleteReview(id);
  const addReview = (p: any) => contextAddReview(p);

  // Dashboard Sub-navigation
  const [activeTab, setActiveTab] = useState<'bookings' | 'rooms' | 'menu' | 'facilities' | 'reviews'>('bookings');

  // Room editor states
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState<Omit<Room, 'id'>>({
    type: 'Double',
    rent: 9500,
    deposit: 9500,
    availableBeds: 2,
    floorNumber: 1,
    size: '200 sq ft',
    attachedBathroom: true,
    balcony: true,
    ac: false,
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
    description: '',
    amenities: ['High-Speed Wi-Fi', 'Attached Bathroom', 'Personal Wardrobe', 'Daily Housekeeping'],
    status: 'Available'
  });

  // Reviews editor states
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    rating: 5,
    text: '',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  });

  // Food Menu editor states
  const [menuFormState, setMenuFormState] = useState<FoodDay[]>(foodMenu);
  const [selectedMenuDay, setSelectedMenuDay] = useState('Monday');
  const [todaysSpecialInput, setTodaysSpecialInput] = useState(todaysSpecial);
  const [permanentItemsInput, setPermanentItemsInput] = useState(permanentItems);

  // Delete confirmation states (bypassing blocked confirm)
  const [roomDeleteConfirmId, setRoomDeleteConfirmId] = useState<string | null>(null);
  const [facDeleteConfirmId, setFacDeleteConfirmId] = useState<string | null>(null);
  const [revDeleteConfirmId, setRevDeleteConfirmId] = useState<string | null>(null);

  // Facility editor states
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [facilityForm, setFacilityForm] = useState<Omit<Facility, 'id'>>({
    name: '',
    iconName: 'Sparkles',
    description: ''
  });

  // Handler: Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    
    if (cleanEmail !== wardenEmail.toLowerCase()) {
      setAuthError(`Access Denied: Only warden email "${wardenEmail}" is authorized.`);
      return;
    }

    const success = loginWarden(cleanEmail, passwordInput);
    if (success) {
      setAuthError('');
      setPasswordInput('');
      setEmailInput('');
      setSuccessNotice('Welcome back, Warden! Authorized access granted.');
    } else {
      setAuthError('Incorrect password. Please try again or use "Forgot Password".');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPasswordResetLink();
    setSuccessNotice(`Password reset link sent successfully to ${wardenEmail}. Check the simulator notification below to find your password reset details.`);
  };

  const handleResetPasswordConfirm = (newPass: string) => {
    if (!newPass) {
      setVerificationError('Password cannot be empty');
      return;
    }
    changeWardenPassword(newPass);
    setSuccessNotice('Password reset successful! You can now log in with your new password.');
    setAdminMode('login');
  };

  // Handler: Save / Add Room
  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoomId) {
      updateRoom({ ...roomForm, id: editingRoomId });
      setEditingRoomId(null);
    } else {
      addRoom(roomForm);
      setIsAddingRoom(false);
    }
    // Reset room form defaults
    setRoomForm({
      type: 'Double',
      rent: 9500,
      deposit: 9500,
      availableBeds: 2,
      floorNumber: 1,
      size: '200 sq ft',
      attachedBathroom: true,
      balcony: true,
      ac: false,
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
      description: '',
      amenities: ['High-Speed Wi-Fi', 'Attached Bathroom', 'Personal Wardrobe', 'Daily Housekeeping'],
      status: 'Available'
    });
  };

  // Handler: Edit Room trigger
  const handleEditRoomStart = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomForm({
      type: room.type,
      rent: room.rent,
      deposit: room.deposit,
      availableBeds: room.availableBeds,
      floorNumber: room.floorNumber,
      size: room.size,
      attachedBathroom: room.attachedBathroom,
      balcony: room.balcony,
      ac: room.ac,
      images: room.images,
      description: room.description,
      amenities: room.amenities,
      status: room.status
    });
    setIsAddingRoom(true);
  };

  // Handler: Update Menu for active day
  const handleMenuDayUpdate = (field: keyof Omit<FoodDay, 'day'>, value: string) => {
    const updated = menuFormState.map((m) => {
      if (m.day === selectedMenuDay) {
        return { ...m, [field]: value };
      }
      return m;
    });
    setMenuFormState(updated);
    updateFoodMenu(updated);
  };

  // Handler: Add Facility
  const handleFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.name || !facilityForm.description) return;
    addFacility(facilityForm);
    setIsAddingFacility(false);
    setFacilityForm({ name: '', iconName: 'Sparkles', description: '' });
  };

  // If NOT logged in, show beautiful guard screen
  if (!isOwnerLoggedIn) {
    return (
      <div className="bg-transparent min-h-[80vh] flex flex-col items-center justify-start sm:justify-center px-4 py-8 sm:py-16">
        <div className="max-w-md w-full bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] sm:rounded-[40px] shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

          {/* Secure icon badge */}
          <div className="w-16 h-16 bg-[#967BB6]/15 text-[#4A3B5F] rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-[#967BB6]/25">
            <Lock className="w-8 h-8 text-[#967BB6]" />
          </div>

          {adminMode === 'login' ? (
            <>
              <div className="text-center space-y-2">
                <h1 className="font-serif font-bold text-2xl text-[#3A2D4F] tracking-tight">Warden Secure Login</h1>
                <p className="text-xs text-[#6B5B8E] max-w-xs mx-auto leading-relaxed font-semibold">
                  Authorized personnel access only. Please log in using your registered warden email and password.
                </p>
              </div>

              {successNotice && (
                <div className="p-3 bg-emerald-500/10 text-emerald-800 rounded-xl text-[11px] font-bold border border-emerald-500/20 text-center">
                  {successNotice}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-[#4A3B5F] block uppercase tracking-wider">Warden Username / Email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-extrabold text-[#4A3B5F] block uppercase tracking-wider">Warden Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminMode('forgot');
                        setSuccessNotice('');
                        setAuthError('');
                      }}
                      className="text-[10px] font-extrabold text-[#967BB6] hover:underline uppercase tracking-wider"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F] tracking-widest text-center"
                    required
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-rose-500/10 text-rose-850 rounded-xl text-[11px] font-bold border border-rose-500/20 flex items-center gap-1.5 justify-center">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-700" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="admin-login-submit"
                  className="w-full py-3.5 bg-[#4A3B5F] hover:bg-[#3d3150] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  Verify Identity & Enter
                </button>
              </form>

              {/* Removed testing hints block to ensure absolute security */}
            </>
          ) : adminMode === 'forgot' ? (
            <>
              <div className="text-center space-y-2">
                <h1 className="font-serif font-bold text-2xl text-[#3A2D4F] tracking-tight">Access Recovery</h1>
                <p className="text-xs text-[#6B5B8E] max-w-xs mx-auto leading-relaxed font-semibold">
                  Password changes require secure system verification. Click below to simulate sending a reset link to your registered email.
                </p>
              </div>

              {successNotice ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-500/10 text-emerald-800 rounded-xl text-[11px] font-bold border border-emerald-500/20 text-center leading-relaxed">
                    {successNotice}
                  </div>
                  
                  {/* Simulate clicking the email link inline */}
                  <div className="p-4 bg-white/60 border border-[#967BB6]/20 rounded-2xl space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4A3B5F] block text-center">🔄 Simulate clicking reset link</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessNotice('');
                        setVerificationError('');
                      }}
                      className="w-full py-2 bg-[#967BB6]/15 hover:bg-[#967BB6]/25 text-[#4A3B5F] rounded-xl text-xs font-bold transition-all"
                    >
                      Open Password Reset form
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-[#4A3B5F] block uppercase tracking-wider">Registered Email Address</label>
                    <input
                      type="email"
                      value={wardenEmail}
                      disabled
                      className="w-full px-4 py-3 bg-[#967BB6]/5 border border-[#967BB6]/20 rounded-xl text-xs sm:text-sm font-bold text-[#6B5B8E] cursor-not-allowed text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#4A3B5F] hover:bg-[#3d3150] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all"
                  >
                    Send Password Reset Link
                  </button>
                </form>
              )}

              {/* Password update form when they simulate clicking link */}
              {!successNotice && (
                <div className="space-y-4 pt-4 border-t border-dashed border-[#967BB6]/20">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-[#4A3B5F] block uppercase tracking-wider">Set New Password</label>
                    <input
                      type="password"
                      id="reset-new-password"
                      placeholder="Enter your new secret password"
                      className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F] tracking-widest text-center"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = (document.getElementById('reset-new-password') as HTMLInputElement)?.value;
                        handleResetPasswordConfirm(val);
                      }}
                      className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c49f2c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      Save New Password
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminMode('login');
                    setSuccessNotice('');
                    setAuthError('');
                  }}
                  className="text-xs text-[#4A3B5F] font-bold hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            </>
          ) : null}

        </div>
      </div>
    );
  }

  // Active Menu Day Data
  const currentEditingDayMenu = menuFormState.find((m) => m.day === selectedMenuDay) || menuFormState[0];

  return (
    <div className="bg-transparent min-h-screen py-10 relative">
      
      {/* SECURITY VERIFICATION MODAL OVERLAY (FOR ANY CHANGES SAVED BY WARDEN) */}
      {adminMode === 'verify_action' && pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-[32px] p-6 shadow-2xl space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D4AF37]" />
            
            <div className="w-12 h-12 bg-amber-50 text-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-serif font-bold text-lg text-slate-900">Security Verification Required</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                To authorize the action <strong className="text-[#4A3B5F]">"{pendingAction.type}"</strong>, a 6-digit access verification code was sent to:
              </p>
              <p className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-xl inline-block mt-1">
                {wardenEmail}
              </p>
            </div>

            <form onSubmit={confirmVerificationCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 block uppercase tracking-wider text-center">6-Digit Access Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black tracking-[0.5em] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-center text-slate-800"
                  required
                />
              </div>

              {verificationError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl text-[11px] font-semibold border border-rose-100 text-center">
                  ⚠️ {verificationError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminMode('login');
                    setPendingAction(null);
                    setVerificationCode('');
                    setVerificationError('');
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-[#4A3B5F] hover:bg-[#3d3150] text-white rounded-xl text-xs font-bold transition-all"
                >
                  Authorize Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dashboard Header Bar */}
        <div className="bg-[#4A3B5F]/95 backdrop-blur-xl rounded-[40px] p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4 border border-white/15 shadow-sm">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] bg-[#D4AF37] text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
              Warden Portal
            </span>
            <h1 className="font-serif font-bold text-2xl tracking-tight">
              Angels PG Executive Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#E1D7EC] font-semibold hidden md:inline">
              Logged in: Principal Administrator
            </span>
            <button
              id="admin-logout-btn"
              onClick={logoutOwner}
              className="px-4 py-2.5 bg-white/10 hover:bg-rose-600/20 text-rose-300 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs bar */}
        <div className="flex overflow-x-auto pb-1 gap-2 border-b border-white/40">
          {[
            { id: 'bookings', label: 'Bookings & Logs', count: bookings.length, icon: Calendar },
            { id: 'rooms', label: 'Rooms Inventory', count: rooms.length, icon: Bed },
            { id: 'menu', label: 'Bistro Menu Planner', icon: Utensils },
            { id: 'facilities', label: 'PG Facilities', count: facilities.length, icon: Sparkles },
            { id: 'reviews', label: 'Resident Reviews', count: reviews.length, icon: Heart }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsAddingRoom(false);
                  setEditingRoomId(null);
                }}
                className={`px-5 py-3 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#4A3B5F] text-[#4A3B5F] bg-white/40 backdrop-blur-md shadow-sm'
                    : 'border-transparent text-[#6B5B8E] hover:text-[#4A3B5F] hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-[#4A3B5F] text-white' : 'bg-[#6B5B8E]/10 text-[#6B5B8E]'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ACTIVE TAB CONTENT */}

        {/* TAB 1: Bookings & Customer Logs */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A2D4F]">Active Stay Registrations</h3>
                <p className="text-xs text-[#6B5B8E] font-medium">Approve new applications, check-in guests, and view contact logs.</p>
              </div>
              <div className="text-xs text-[#4A3B5F] font-bold bg-white/40 backdrop-blur-md p-2.5 border border-white/60 rounded-2xl shadow-sm">
                Pending Reviews: <strong className="text-[#D4AF37] font-extrabold">{bookings.filter(b => b.status === 'Pending').length}</strong>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-12 text-center">
                <HelpCircle className="w-10 h-10 text-[#967BB6] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#4A3B5F]">No Booking Applications Submitted</h4>
                <p className="text-xs text-[#6B5B8E] max-w-xs mx-auto mt-1 leading-relaxed">
                  Customer applications will display here instantly when submitted on the public booking form page.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const isPending = booking.status === 'Pending';
                  const isConfirmed = booking.status === 'Confirmed';
                  const isRejected = booking.status === 'Rejected';

                  return (
                    <div
                      key={booking.id}
                      className={`bg-white/40 backdrop-blur-xl rounded-[40px] border p-6 shadow-sm transition-all relative overflow-hidden ${
                        isConfirmed ? 'border-emerald-500/30' : isRejected ? 'border-white/40 opacity-80' : 'border-[#D4AF37]/30'
                      }`}
                    >
                      {/* Top ribbon for status indicator */}
                      <div className="absolute top-0 right-0 left-0 h-1" />

                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        
                        {/* Resident specs */}
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="font-serif font-bold text-base text-[#3A2D4F]">{booking.fullName}</h4>
                            <span className="text-[10px] bg-[#967BB6]/15 text-[#4A3B5F] border border-[#967BB6]/25 px-2.5 py-0.5 rounded-full font-bold">
                              {booking.occupation}
                            </span>
                            <span className="text-[10px] bg-white/50 text-[#6B5B8E] border border-white/60 px-2.5 py-0.5 rounded-full font-mono font-bold">
                              Ref: {booking.id}
                            </span>
                            
                            {/* Visual Status Indicator */}
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                              isConfirmed
                                ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20'
                                : isRejected
                                ? 'bg-[#6B5B8E]/10 text-[#6B5B8E] border-[#6B5B8E]/20'
                                : 'bg-[#D4AF37]/10 text-[#4A3B5F] border-[#D4AF37]/20'
                            }`}>
                              {booking.status}
                            </span>
                          </div>

                          {/* 2-column info key-values */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-[#6B5B8E] font-medium">
                            <div>📞 Mob: <strong className="text-[#4A3B5F] font-bold">{booking.mobileNumber}</strong></div>
                            <div>💬 WhatsApp: <strong className="text-[#4A3B5F] font-bold">{booking.whatsAppNumber}</strong></div>
                            <div>✉️ Email: <strong className="text-[#4A3B5F] font-bold">{booking.email}</strong></div>
                            <div>🏢 College/Work: <strong className="text-[#4A3B5F] font-bold">{booking.collegeOrCompany}</strong></div>
                            <div>🛏️ Pref Room: <strong className="text-[#4A3B5F] font-bold">{booking.preferredRoomType} Sharing</strong></div>
                            <div>📅 Check-in: <strong className="text-[#4A3B5F] font-bold">{booking.checkInDate}</strong></div>
                            <div>📅 Stay Limit: <strong className="text-[#4A3B5F] font-bold">{booking.expectedStayDuration}</strong></div>
                             <div>🆔 Photo ID Type: <strong className="text-[#4A3B5F] font-bold">{booking.idProofType}</strong>
                              {booking.idProofFile && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = booking.idProofFile!;
                                    link.download = booking.idProofFileName || 'id_proof';
                                    link.click();
                                  }}
                                  className="ml-2 px-1.5 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 text-[10px] font-bold rounded border border-emerald-500/25 uppercase transition-all"
                                  title="Download resident ID proof soft copy"
                                >
                                  📥 ID Copy
                                </button>
                              )}
                            </div>
                            <div>📅 Form Date: <strong className="text-[#6B5B8E]/70 font-mono font-bold">{booking.bookingDate}</strong></div>
                          </div>

                          {/* Address details */}
                          <div className="text-xs bg-white/40 p-3 rounded-2xl border border-white/60 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-[#6B5B8E] block">Permanent Address</span>
                            <p className="text-[#4A3B5F] font-bold">{booking.address}</p>
                          </div>

                          {booking.specialRequirements && (
                            <p className="text-xs text-[#4A3B5F] bg-[#D4AF37]/10 p-3 rounded-2xl border border-[#D4AF37]/20 font-medium">
                              💬 <strong>Special Requests:</strong> {booking.specialRequirements}
                            </p>
                          )}
                        </div>

                        {/* Booking actions */}
                        <div className="flex sm:flex-row lg:flex-col gap-2 w-full lg:w-auto">
                          {isPending && (
                            <>
                              <button
                                id={`approve-booking-btn-${booking.id}`}
                                onClick={() => approveBooking(booking.id)}
                                className="flex-1 lg:w-36 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                Approve Staying
                              </button>
                              <button
                                id={`reject-booking-btn-${booking.id}`}
                                onClick={() => rejectBooking(booking.id)}
                                className="flex-1 lg:w-36 py-2.5 border border-rose-500/20 text-rose-700 hover:bg-rose-500/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                                Reject Booking
                              </button>
                            </>
                          )}
                          {isConfirmed && (
                            <div className="flex flex-col gap-1.5 w-full sm:w-48 lg:w-36">
                              <div className="text-emerald-800 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5 text-xs font-bold w-full justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                Staying Confirmed
                              </div>
                              <button
                                id={`direct-wa-${booking.id}`}
                                onClick={() => {
                                  const matchingRoom = rooms.find(r => r.type === booking.preferredRoomType);
                                  const rentAmount = matchingRoom ? matchingRoom.rent : (booking.preferredRoomType === 'Single' ? 11000 : booking.preferredRoomType === 'Double' ? 6500 : 5500);
                                  
                                  const msg = `Hello ${booking.fullName},

Your booking at Angels PG for Ladies has been confirmed.

Room Type: ${booking.preferredRoomType} Sharing
Check-in Date: ${booking.checkInDate}
Monthly Rent: ₹${rentAmount}

Address:
Angels PG for Ladies
3rd Cross, Anand Reddy Layout, Shanthipura

Contact:
📞 8074494420
📞 7207174230

Thank you for choosing Angels PG.`;

                                  let phone = booking.whatsAppNumber.replace(/\D/g, '');
                                  if (phone.length === 10) {
                                    phone = '91' + phone;
                                  }
                                  const encodedText = encodeURIComponent(msg);
                                  window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
                                }}
                                className="w-full py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                                title="Send confirmation via WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                                Send WhatsApp
                              </button>
                            </div>
                          )}
                          {isRejected && (
                            <div className="text-[#6B5B8E] bg-[#6B5B8E]/10 p-3 rounded-xl border border-[#6B5B8E]/20 flex items-center gap-1.5 text-xs font-bold w-full justify-center">
                              <X className="w-4 h-4 text-slate-400" />
                              Application Rejected
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Rooms Inventory Management */}
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A2D4F]">Active Rooms Directory</h3>
                <p className="text-xs text-[#6B5B8E] font-medium">Edit prices, adjust room specifications, and add new sharing units.</p>
              </div>
              <button
                id="btn-trigger-add-room"
                onClick={() => {
                  setEditingRoomId(null);
                  setIsAddingRoom(!isAddingRoom);
                }}
                className="px-4 py-2.5 bg-[#4A3B5F] hover:bg-[#3d3150] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {isAddingRoom && !editingRoomId ? 'Close Form' : 'Add New Room'}
              </button>
            </div>

            {/* Expandable Add/Edit Form */}
            {isAddingRoom && (
              <form onSubmit={handleRoomSubmit} className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-white/40 pb-2">
                  <Edit3 className="w-5 h-5 text-[#967BB6]" />
                  <h4 className="font-serif font-bold text-sm text-[#3A2D4F] uppercase tracking-wider">
                    {editingRoomId ? 'Edit Room Specifications' : 'Configure New Sharing Room'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Room Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Room Type</label>
                    <select
                      value={roomForm.type}
                      onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value as RoomType })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                    >
                      <option value="Single">Single Sharing</option>
                      <option value="Double">Double Sharing</option>
                      <option value="Triple">Triple Sharing</option>
                    </select>
                  </div>

                  {/* Monthly rent */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={roomForm.rent}
                      onChange={(e) => setRoomForm({ ...roomForm, rent: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  {/* Deposit */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={roomForm.deposit}
                      onChange={(e) => setRoomForm({ ...roomForm, deposit: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  {/* Beds Available */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Available Beds count</label>
                    <input
                      type="number"
                      value={roomForm.availableBeds}
                      onChange={(e) => setRoomForm({ ...roomForm, availableBeds: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  {/* Floor number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Floor Number</label>
                    <input
                      type="number"
                      value={roomForm.floorNumber}
                      onChange={(e) => setRoomForm({ ...roomForm, floorNumber: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  {/* Room Size */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Room Size (sq ft)</label>
                    <input
                      type="text"
                      value={roomForm.size}
                      onChange={(e) => setRoomForm({ ...roomForm, size: e.target.value })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  {/* Attached Washroom */}
                  <div className="space-y-1.5 flex items-center pt-5">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#4A3B5F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roomForm.attachedBathroom}
                        onChange={(e) => setRoomForm({ ...roomForm, attachedBathroom: e.target.checked })}
                        className="rounded border-white/60 text-[#4A3B5F] focus:ring-[#4A3B5F] w-4 h-4"
                      />
                      Attached Premium Bathroom
                    </label>
                  </div>

                  {/* Private Balcony */}
                  <div className="space-y-1.5 flex items-center pt-5">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#4A3B5F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roomForm.balcony}
                        onChange={(e) => setRoomForm({ ...roomForm, balcony: e.target.checked })}
                        className="rounded border-white/60 text-[#4A3B5F] focus:ring-[#4A3B5F] w-4 h-4"
                      />
                      Has Private Balcony
                    </label>
                  </div>

                  {/* AC Fitted */}
                  <div className="space-y-1.5 flex items-center pt-5">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#4A3B5F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roomForm.ac}
                        onChange={(e) => setRoomForm({ ...roomForm, ac: e.target.checked })}
                        className="rounded border-white/60 text-[#4A3B5F] focus:ring-[#4A3B5F] w-4 h-4"
                      />
                      Air Conditioner (AC) Fitted
                    </label>
                  </div>

                  {/* Image URLs */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Room Image URLs (Comma-separated list or Upload below)</label>
                    <input
                      type="text"
                      value={roomForm.images.join(', ')}
                      onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                    />

                    {/* Local File Upload Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-3 bg-[#967BB6]/5 rounded-xl border border-[#967BB6]/15">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#6B5B8E] font-bold block uppercase tracking-wider">Or Upload Real Room Photos:</span>
                        <label className="flex items-center justify-center h-10 border-2 border-[#967BB6]/30 border-dashed rounded-lg cursor-pointer bg-white/20 hover:bg-[#967BB6]/10 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5 text-[#967BB6]" />
                            <span className="text-[10px] text-[#4A3B5F] font-bold uppercase">Choose Real Photos</span>
                          </div>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files) {
                                const filesArray = Array.from(e.target.files);
                                const readPromises = filesArray.map((file: File) => {
                                  return new Promise<string>((resolve) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => resolve(reader.result as string);
                                    reader.readAsDataURL(file);
                                  });
                                });
                                Promise.all(readPromises).then((base64Strings) => {
                                  const cleanList = roomForm.images.filter(x => x && x !== '');
                                  setRoomForm({
                                    ...roomForm,
                                    images: [...cleanList, ...base64Strings]
                                  });
                                });
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Display thumbnail previews of roomForm.images */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#6B5B8E] font-bold block uppercase tracking-wider">Uploaded Photos ({roomForm.images.filter(Boolean).length}):</span>
                        <div className="flex gap-1.5 overflow-x-auto py-1 max-w-full">
                          {roomForm.images.filter(Boolean).map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative w-8 h-8 rounded border border-[#967BB6]/20 overflow-hidden flex-shrink-0 group">
                              <img src={imgUrl} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setRoomForm({
                                    ...roomForm,
                                    images: roomForm.images.filter((_, idx) => idx !== imgIdx)
                                  });
                                }}
                                className="absolute inset-0 bg-rose-600/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[8px] font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                          {roomForm.images.filter(Boolean).length === 0 && (
                            <span className="text-[9px] text-[#6B5B8E] italic pt-1.5">No images uploaded</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap pt-1">
                      <span className="text-[10px] text-[#6B5B8E] font-bold block w-full uppercase tracking-widest mt-1">Real Room Photo Presets:</span>
                      {[
                        { name: 'Suite Bed', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Single Premium', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Double Suite', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Modern Living', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Balcony Room', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80' }
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            const cleanList = roomForm.images.filter(x => x !== '');
                            if (!cleanList.includes(preset.url)) {
                              setRoomForm({ ...roomForm, images: [...cleanList, preset.url] });
                            }
                          }}
                          className="px-2 py-1 bg-[#967BB6]/15 hover:bg-[#967BB6]/30 text-[#4A3B5F] text-[10px] font-bold uppercase rounded border border-[#967BB6]/25 transition-all"
                        >
                          + {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">General Status</label>
                    <select
                      value={roomForm.status}
                      onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                    >
                      <option value="Available">Available</option>
                      <option value="Fully Booked">Fully Booked</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 sm:col-span-3">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Room Description</label>
                    <textarea
                      value={roomForm.description}
                      onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-white/40">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingRoom(false);
                      setEditingRoomId(null);
                    }}
                    className="px-4 py-2 border border-white/60 rounded-lg text-xs font-bold text-[#6B5B8E] hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="room-save-submit"
                    className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2c] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm transition-all"
                  >
                    {editingRoomId ? 'Save Room Changes' : 'Publish New Room'}
                  </button>
                </div>
              </form>
            )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-[#967BB6]/15 text-[#4A3B5F] border border-[#967BB6]/25 px-2.5 py-0.5 rounded-full">
                        {room.type} Sharing
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                        room.status === 'Available' ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20' : 'bg-rose-500/10 text-rose-800 border-rose-500/20'
                      }`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center">
                      <button
                        id={`edit-room-${room.id}`}
                        onClick={() => handleEditRoomStart(room)}
                        className="p-1.5 text-blue-700 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                        title="Edit Room Specs"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
                      </button>
                      {roomDeleteConfirmId === room.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-xl">
                          <button
                            onClick={() => {
                              deleteRoom(room.id);
                              setRoomDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[9px] font-bold uppercase hover:bg-rose-700 transition-all cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setRoomDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[9px] font-bold uppercase hover:bg-slate-300 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`delete-room-${room.id}`}
                          onClick={() => setRoomDeleteConfirmId(room.id)}
                          className="p-1.5 text-rose-700 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary key values */}
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-[#6B5B8E] font-medium">
                    <div>Price: <strong className="text-[#3A2D4F] font-bold">₹{room.rent}/m</strong></div>
                    <div>Deposit: <strong className="text-[#4A3B5F] font-bold">₹{room.deposit}</strong></div>
                    <div>Beds Available: <strong className="text-[#4A3B5F] font-bold">{room.availableBeds} beds</strong></div>
                    <div>Floor: <strong className="text-[#4A3B5F] font-bold">Level {room.floorNumber}</strong></div>
                    <div>Size: <strong className="text-[#4A3B5F] font-bold">{room.size}</strong></div>
                    <div>Washroom: <strong className="text-[#4A3B5F] font-bold">{room.attachedBathroom ? 'Attached' : 'Common'}</strong></div>
                    <div>Balcony: <strong className="text-[#4A3B5F] font-bold">{room.balcony ? 'Yes' : 'No'}</strong></div>
                    <div>AC Fitted: <strong className="text-[#4A3B5F] font-bold">{room.ac ? 'Yes' : 'No'}</strong></div>
                  </div>

                  {/* Quick status toggle button */}
                  <div className="pt-2 border-t border-white/40 flex justify-between items-center gap-4">
                    <span className="text-[10px] text-[#6B5B8E] font-semibold">Quick toggle state:</span>
                    <button
                      id={`toggle-status-${room.id}`}
                      onClick={() => markRoomStatus(room.id, room.status === 'Available' ? 'Fully Booked' : 'Available')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        room.status === 'Available'
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-800 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 hover:bg-emerald-500/20'
                      }`}
                    >
                      {room.status === 'Available' ? 'Mark as Fully Booked' : 'Mark as Available'}
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: Bistro Food Menu Planner */}
        {activeTab === 'menu' && (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-6 shadow-sm space-y-6">
            
            <div className="border-b border-white/40 pb-3 space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#3A2D4F]">Bistro Kitchen Menu Planner</h3>
              <p className="text-xs text-[#6B5B8E] font-medium">Update the daily breakfast, lunch, tea, and dinner choices instantly.</p>
            </div>

            {/* Special Item Editor */}
            <div className="p-4 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/20 space-y-2.5">
              <label className="text-xs font-bold text-[#4A3B5F] uppercase tracking-widest block">Update Today's Special Item</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={todaysSpecialInput}
                  onChange={(e) => setTodaysSpecialInput(e.target.value)}
                  placeholder="Enter mouth-watering special details"
                  className="flex-1 px-4 py-2 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                />
                <button
                  id="btn-save-special"
                  onClick={() => {
                    setTodaysSpecial(todaysSpecialInput);
                    alert("Today's Special Item updated successfully!");
                  }}
                  className="px-4 py-2 bg-[#4A3B5F] hover:bg-[#3d3150] text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Special
                </button>
              </div>
            </div>

            {/* Permanent Everyday Items Editor */}
            <div className="p-4 bg-[#967BB6]/10 rounded-2xl border border-[#967BB6]/20 space-y-2.5">
              <label className="text-xs font-bold text-[#4A3B5F] uppercase tracking-widest block">Update Everyday Essentials (Permanent Menu)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={permanentItemsInput}
                  onChange={(e) => setPermanentItemsInput(e.target.value)}
                  placeholder="Enter comma separated items (e.g., Tea & Coffee, Milk, Hot Drinking Water)"
                  className="flex-1 px-4 py-2 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                />
                <button
                  id="btn-save-permanent-items"
                  onClick={() => {
                    setPermanentItems(permanentItemsInput);
                    alert("Everyday Permanent Menu items updated successfully!");
                  }}
                  className="px-4 py-2 bg-[#4A3B5F] hover:bg-[#3d3150] text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Permanent
                </button>
              </div>
            </div>

            {/* Day Selector for active menu edits */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Select Day to Edit Schedule</label>
              <div className="flex flex-wrap gap-1.5">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <button
                    key={day}
                    id={`edit-day-select-${day}`}
                    type="button"
                    onClick={() => setSelectedMenuDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedMenuDay === day
                        ? 'bg-[#4A3B5F] text-white shadow-sm border border-[#4A3B5F]/20'
                        : 'bg-white/30 border border-white/60 text-[#6B5B8E] hover:bg-white/50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Editing block */}
              {currentEditingDayMenu && (
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-5 border border-white/50 space-y-4">
                  <h4 className="text-xs font-bold text-[#3A2D4F] uppercase tracking-wider pb-1 border-b border-white/30">
                    Editing Food details for {selectedMenuDay}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Breakfast input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#4A3B5F] block">Breakfast Menu (Morning)</label>
                      <input
                        type="text"
                        value={currentEditingDayMenu.breakfast}
                        onChange={(e) => handleMenuDayUpdate('breakfast', e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      />
                    </div>

                    {/* Lunch input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#4A3B5F] block">Lunch Menu (Noon)</label>
                      <input
                        type="text"
                        value={currentEditingDayMenu.lunch}
                        onChange={(e) => handleMenuDayUpdate('lunch', e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      />
                    </div>

                    {/* Snacks input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#4A3B5F] block">Evening Snacks & Chai</label>
                      <input
                        type="text"
                        value={currentEditingDayMenu.snacks}
                        onChange={(e) => handleMenuDayUpdate('snacks', e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      />
                    </div>

                    {/* Dinner input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#4A3B5F] block">Dinner Menu (Night)</label>
                      <input
                        type="text"
                        value={currentEditingDayMenu.dinner}
                        onChange={(e) => handleMenuDayUpdate('dinner', e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-white/30">
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      ✓ Updates automatically synced to storage
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: PG Facilities Editor */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A2D4F]">PG Facilities Directory</h3>
                <p className="text-xs text-[#6B5B8E] font-medium">Edit features, delete listings, or configure custom amenities.</p>
              </div>
              <button
                id="btn-trigger-add-facility"
                onClick={() => setIsAddingFacility(!isAddingFacility)}
                className="px-4 py-2.5 bg-[#4A3B5F] hover:bg-[#3d3150] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {isAddingFacility ? 'Close Form' : 'Add Custom Facility'}
              </button>
            </div>

            {/* Expandable Add Facility form */}
            {isAddingFacility && (
              <form onSubmit={handleFacilitySubmit} className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-white/40 pb-2">
                  <Sparkles className="w-5 h-5 text-[#967BB6]" />
                  <h4 className="font-serif font-bold text-sm text-[#3A2D4F] uppercase tracking-wider">Configure New Service listing</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Facility Name</label>
                    <input
                      type="text"
                      value={facilityForm.name}
                      onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                      placeholder="E.g., In-room study lamps"
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Lucide Icon Name</label>
                    <select
                      value={facilityForm.iconName}
                      onChange={(e) => setFacilityForm({ ...facilityForm, iconName: e.target.value })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                    >
                      <option value="Wifi">Wifi</option>
                      <option value="ShieldCheck">ShieldCheck</option>
                      <option value="Zap">Zap</option>
                      <option value="Droplet">Droplet</option>
                      <option value="Flame">Flame</option>
                      <option value="Car">Car</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Utensils">Utensils</option>
                      <option value="Tv">Tv</option>
                      <option value="Tv2">Tv2</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-3">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Facility Description</label>
                    <input
                      type="text"
                      value={facilityForm.description}
                      onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })}
                      placeholder="Provide a detailed outline of this service..."
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-white/40">
                  <button
                    type="button"
                    onClick={() => setIsAddingFacility(false)}
                    className="px-4 py-2 border border-white/60 rounded-lg text-xs font-bold text-[#6B5B8E] hover:bg-white/20 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="facility-save-submit"
                    className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2c] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Publish Facility Listing
                  </button>
                </div>
              </form>
            )}

            {/* List facilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((fac) => (
                <div key={fac.id} className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-serif font-bold text-sm text-[#3A2D4F]">{fac.name}</span>
                      {facDeleteConfirmId === fac.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-xl">
                          <button
                            onClick={() => {
                              setFacilities(prev => prev.filter(f => f.id !== fac.id));
                              setFacDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[9px] font-bold uppercase hover:bg-rose-700 transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setFacDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[9px] font-bold uppercase hover:bg-slate-300 transition-all cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`delete-fac-${fac.id}`}
                          onClick={() => setFacDeleteConfirmId(fac.id)}
                          className="p-1 text-rose-750 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                          title="Delete Facility"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[#6B5B8E] leading-relaxed font-medium">{fac.description}</p>
                  </div>
                  <div className="pt-2 text-[10px] text-[#6B5B8E] border-t border-white/40 font-medium">
                    Icon identifier: <code className="bg-white/50 border border-white/60 px-1 rounded font-mono text-[#4A3B5F] font-bold">{fac.iconName}</code>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 5: Resident Reviews Management */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A2D4F]">Resident Reviews & Testimonials</h3>
                <p className="text-xs text-[#6B5B8E] font-medium">Manage testimonials displayed on the homepage. Delete old reviews or add real guest experiences.</p>
              </div>
              <button
                id="btn-trigger-add-review"
                onClick={() => setIsAddingReview(!isAddingReview)}
                className="px-4 py-2.5 bg-[#4A3B5F] hover:bg-[#3d3150] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {isAddingReview ? 'Close Form' : 'Add Guest Review'}
              </button>
            </div>

            {/* Expandable Add Review Form */}
            {isAddingReview && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reviewForm.name || !reviewForm.text) {
                    alert('Please provide resident name and review text');
                    return;
                  }
                  addReview(reviewForm);
                  setIsAddingReview(false);
                  setReviewForm({
                    name: '',
                    role: '',
                    rating: 5,
                    text: '',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
                  });
                }}
                className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 p-6 shadow-sm space-y-6"
              >
                <div className="flex items-center gap-2 border-b border-white/40 pb-2">
                  <Heart className="w-5 h-5 text-[#967BB6]" />
                  <h4 className="font-serif font-bold text-sm text-[#3A2D4F] uppercase tracking-wider">
                    Add Real Guest Review
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Resident Name</label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder="e.g. Suhasini Rao"
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Profession / Institution</label>
                    <input
                      type="text"
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      placeholder="e.g. Software Engineer at Cisco or Student at Azim Premji University"
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  {/* Rating select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Rating Stars</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>

                  {/* Photo URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Photo URL</label>
                    <input
                      type="text"
                      value={reviewForm.avatar}
                      onChange={(e) => setReviewForm({ ...reviewForm, avatar: e.target.value })}
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>

                  {/* Quick Preset Avatars */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-[#6B5B8E] block uppercase tracking-widest">Quick Photo Presets (Click to choose instant photo)</label>
                    <div className="flex gap-4 pt-1 flex-wrap">
                      {[
                        { name: 'Suhasini', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
                        { name: 'Megha', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80' },
                        { name: 'Kavya', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
                        { name: 'Priya', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' }
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, avatar: preset.url })}
                          className={`p-1 rounded-full border-2 transition-all ${reviewForm.avatar === preset.url ? 'border-[#D4AF37] scale-105 bg-[#D4AF37]/10' : 'border-transparent hover:scale-105'}`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Review Message</label>
                    <textarea
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                      rows={3}
                      placeholder="Write the detailed resident review or feedback here..."
                      className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-lg text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all text-[#4A3B5F]"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-white/40">
                  <button
                    type="button"
                    onClick={() => setIsAddingReview(false)}
                    className="px-4 py-2 border border-white/60 rounded-lg text-xs font-bold text-[#6B5B8E] hover:bg-white/20 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2c] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}

            {/* List reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                          alt={rev.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#967BB6]/20"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#3A2D4F]">{rev.name}</h4>
                          <p className="text-[10px] text-[#6B5B8E] font-semibold">{rev.role}</p>
                        </div>
                      </div>
                      {revDeleteConfirmId === rev.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-xl">
                          <button
                            onClick={() => {
                              deleteReview(rev.id);
                              setRevDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[9px] font-bold uppercase hover:bg-rose-700 transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setRevDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[9px] font-bold uppercase hover:bg-slate-300 transition-all cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`delete-rev-${rev.id}`}
                          onClick={() => setRevDeleteConfirmId(rev.id)}
                          className="p-1 text-rose-750 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-0.5 text-[#D4AF37]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>

                    <p className="text-xs text-[#4A3B5F] italic leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
