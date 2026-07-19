import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoomType } from '../types';
import { Calendar, User, Phone, Mail, Building, Briefcase, FileText, Sparkles, ShieldCheck, Heart, ArrowRight, CheckCircle2, Upload, Trash2, Paperclip } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { addBooking, setCurrentView } = useApp();

  // Booking Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    whatsAppNumber: '',
    email: '',
    collegeOrCompany: '',
    occupation: 'Student' as 'Student' | 'Employee',
    gender: 'Female', // Default to female as it's Angels PG for Ladies
    address: '',
    idProofType: 'Aadhaar Card',
    idProofFile: '',
    idProofFileName: '',
    preferredRoomType: 'Double' as RoomType,
    checkInDate: '',
    expectedStayDuration: '6 Months',
    numberOccupants: 1,
    specialRequirements: ''
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIdFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIdFile(e.target.files[0]);
    }
  };

  const handleIdFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        idProofFile: reader.result as string,
        idProofFileName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      idProofFile: '',
      idProofFileName: ''
    }));
  };

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdRefId, setCreatedRefId] = useState('');

  // Auto-copy mobile to whatsapp if checkbox checked
  const [syncWhatsApp, setSyncWhatsApp] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If we are updating mobileNumber and sync is active, sync WhatsApp
      if (name === 'mobileNumber' && syncWhatsApp) {
        updated.whatsAppNumber = value;
      }
      return updated;
    });

    // Clear error
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSyncChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSyncWhatsApp(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, whatsAppNumber: prev.mobileNumber }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile Number is required';
    if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      errors.mobileNumber = 'Provide a valid 10-digit phone number';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Provide a valid email address';
    }
    if (!formData.checkInDate) errors.checkInDate = 'Preferred check-in date is required';
    if (!formData.address.trim()) errors.address = 'Current permanent address is required';
    if (!formData.collegeOrCompany.trim()) errors.collegeOrCompany = 'College / Company name is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // Submit booking data to global context state
    const bookingResult = addBooking(formData);
    
    // Set success screens
    setCreatedRefId(bookingResult.id);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="bg-transparent min-h-screen py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-sm p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
          
          {/* Confetti / Sparkles decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          {/* Animated Success Icon */}
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm border border-emerald-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Booking Submitted Successfully
            </span>
            <h1 className="font-serif font-bold text-3xl text-[#3A2D4F] tracking-tight">
              Request is now Pending Approval!
            </h1>
            <p className="text-xs text-[#6B5B8E] max-w-md mx-auto leading-relaxed">
              Thank you for choosing <strong>Angels PG for Ladies</strong>. Your digital application reference code is <strong className="text-[#4A3B5F] bg-white/40 px-2 py-0.5 rounded border border-white/60">{createdRefId}</strong>.
            </p>
          </div>

          {/* Next steps timeline indicator */}
          <div className="p-6 bg-white/40 rounded-3xl text-left border border-white/60 space-y-4">
            <h4 className="font-serif font-bold text-xs text-[#3A2D4F] uppercase tracking-widest">What happens next?</h4>
            <ul className="space-y-3 text-xs text-[#6B5B8E] font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4A3B5F] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</span>
                <span className="leading-relaxed">The PG Warden will review your details, preferred room availability, and preferred check-in date.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4A3B5F] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</span>
                <span className="leading-relaxed">Upon approval, the system will automatically send a **WhatsApp confirmation message** with rent details.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#4A3B5F] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</span>
                <span className="leading-relaxed">You can then visit the PG, complete physical ID checks, pay the deposit, and comfortably check-in!</span>
              </li>
            </ul>
          </div>

          {/* Quick Info Badge */}
          <div className="flex items-center gap-2.5 bg-[#D4AF37]/10 text-[#4A3B5F] border border-[#D4AF37]/20 p-4 rounded-2xl text-xs text-left">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
            <p className="font-medium">
              <strong>Immediate Attention:</strong> To speed up your approval, feel free to ring us directly on WhatsApp with your name and Reference code <strong>{createdRefId}</strong>!
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="success-back-home"
              onClick={() => setCurrentView('home')}
              className="px-6 py-3 bg-[#4A3B5F] hover:bg-[#3d3150] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all"
            >
              Back to Home
            </button>
            <button
              id="success-view-rooms"
              onClick={() => setCurrentView('rooms')}
              className="px-6 py-3 border border-white/60 bg-white/40 text-[#4A3B5F] hover:bg-white/60 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Explore Other Rooms
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase rounded-full">
            Safe Women's Living Registration
          </div>
          <h1 className="font-serif italic font-normal text-4xl sm:text-5xl text-[#3A2D4F] leading-tight">
            Apply to Angels Ladies PG
          </h1>
          <p className="text-[#6B5B8E] max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
            Fill in your complete verification details to submit a booking. No instant fee is required. The PG administrator will verify and contact you instantly.
          </p>
        </div>

        {/* Info ribbon */}
        <div className="bg-[#4A3B5F] text-white rounded-3xl p-4 mb-8 flex items-center gap-3 border border-white/10 shadow-sm text-xs sm:text-sm">
          <ShieldCheck className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
          <span className="leading-relaxed font-medium">
            <strong>Angels PG Safety Rule:</strong> We accommodate women residents only. For validation, a government-approved photo ID (like Aadhaar, Passport, or PAN) is mandatory during checking.
          </span>
        </div>

        {/* Main form container */}
        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-sm overflow-hidden">
          
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* SECTION 1: Personal Particulars */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-white/40 pb-3">
                <User className="w-5 h-5 text-[#967BB6]" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#3A2D4F] uppercase tracking-wider">1. Resident Particulars</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] flex items-center gap-1 uppercase tracking-wider">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your first & last name"
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all ${
                      formErrors.fullName ? 'border-rose-400 focus:ring-rose-200' : 'border-white/60'
                    }`}
                  />
                  {formErrors.fullName && <p className="text-[10px] text-rose-500 font-bold">{formErrors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] flex items-center gap-1 uppercase tracking-wider">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@gmail.com"
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all ${
                      formErrors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-white/60'
                    }`}
                  />
                  {formErrors.email && <p className="text-[10px] text-rose-500 font-bold">{formErrors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] flex items-center gap-1 uppercase tracking-wider">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all ${
                      formErrors.mobileNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-white/60'
                    }`}
                  />
                  {formErrors.mobileNumber && <p className="text-[10px] text-rose-500 font-bold">{formErrors.mobileNumber}</p>}
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#4A3B5F] uppercase tracking-wider">WhatsApp Number</label>
                    <label className="inline-flex items-center gap-1.5 text-[10px] text-[#6B5B8E] font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={syncWhatsApp}
                        onChange={handleSyncChange}
                        className="rounded border-white/60 text-[#4A3B5F] focus:ring-[#4A3B5F] w-3.5 h-3.5"
                      />
                      Same as Mobile
                    </label>
                  </div>
                  <input
                    type="tel"
                    name="whatsAppNumber"
                    value={formData.whatsAppNumber}
                    onChange={handleInputChange}
                    disabled={syncWhatsApp}
                    placeholder="WhatsApp contact number"
                    className="w-full px-4 py-3 bg-white/30 disabled:opacity-75 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                  />
                </div>

                {/* Occupation Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Occupation</label>
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                  >
                    <option value="Student">Student</option>
                    <option value="Employee">Working Professional</option>
                  </select>
                </div>

                {/* College / Company name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] flex items-center gap-1 uppercase tracking-wider">
                    College / Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="collegeOrCompany"
                    value={formData.collegeOrCompany}
                    onChange={handleInputChange}
                    placeholder="E.g., Azim Premji University, TCS, etc."
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all ${
                      formErrors.collegeOrCompany ? 'border-rose-400 focus:ring-rose-200' : 'border-white/60'
                    }`}
                  />
                  {formErrors.collegeOrCompany && <p className="text-[10px] text-rose-500 font-bold">{formErrors.collegeOrCompany}</p>}
                </div>

                {/* ID Proof Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">ID Proof Type</label>
                  <select
                    name="idProofType"
                    value={formData.idProofType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                  >
                    <option value="Aadhaar Card">Aadhaar Card (Recommended)</option>
                    <option value="Passport">Passport</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="College ID / Employee ID">College ID / Work ID</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                {/* ID Proof Soft Copy Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">
                    Upload ID Proof Soft Copy <span className="text-[10px] text-slate-500 font-normal font-sans">(Optional)</span>
                  </label>
                  
                  {!formData.idProofFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all h-[50px] sm:h-[48px] ${
                        isDragging 
                          ? 'border-[#4A3B5F] bg-[#967BB6]/10' 
                          : 'border-white/60 bg-white/30 hover:bg-white/50'
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer w-full h-full justify-center">
                        <Upload className="w-4 h-4 text-[#967BB6]" />
                        <span className="text-[11px] text-[#4A3B5F] font-bold">
                          {isDragging ? 'Drop file here' : 'Click or Drag ID copy to upload'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-[11px] font-bold text-emerald-800 truncate">
                          {formData.idProofFileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-all flex-shrink-0"
                        title="Remove uploaded ID"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Gender (Static display with clarification as it's a ladies PG) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Resident Gender</label>
                  <div className="w-full px-4 py-3 bg-[#967BB6]/15 text-[#4A3B5F] font-bold rounded-xl text-xs sm:text-sm flex justify-between items-center border border-[#967BB6]/25">
                    <span>Female</span>
                    <span className="text-[10px] bg-[#4A3B5F] text-white px-2 py-0.5 rounded-full uppercase">LADIES PG ONLY</span>
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#4A3B5F] flex items-center gap-1 uppercase tracking-wider">
                    Permanent Home Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Enter your detailed home address (city, state, pincode)"
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all ${
                      formErrors.address ? 'border-rose-400 focus:ring-rose-200' : 'border-white/60'
                    }`}
                  />
                  {formErrors.address && <p className="text-[10px] text-rose-500 font-bold">{formErrors.address}</p>}
                </div>

              </div>
            </div>

            {/* SECTION 2: Stay & Room preferences */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-2 border-b border-white/40 pb-3">
                <Calendar className="w-5 h-5 text-[#967BB6]" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#3A2D4F] uppercase tracking-wider">2. Booking & Room Preferences</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Preferred Room Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Preferred Room Sharing</label>
                  <select
                    name="preferredRoomType"
                    value={formData.preferredRoomType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                  >
                    <option value="Single">Single Sharing Suite (₹11,000/m)</option>
                    <option value="Double">Double Sharing Suite (₹6,500/m)</option>
                    <option value="Triple">Triple Sharing Suite (₹5,500/m)</option>
                  </select>
                </div>

                {/* Check-in date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] flex items-center gap-1 uppercase tracking-wider">
                    Preferred Check-in Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]} // Can't book past dates
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all ${
                      formErrors.checkInDate ? 'border-rose-400 focus:ring-rose-200' : 'border-white/60'
                    }`}
                  />
                  {formErrors.checkInDate && <p className="text-[10px] text-rose-500 font-bold">{formErrors.checkInDate}</p>}
                </div>

                {/* Expected Stay Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Expected Stay Duration</label>
                  <select
                    name="expectedStayDuration"
                    value={formData.expectedStayDuration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                  >
                    <option value="None">None</option>
                    <option value="1 Month">1 Month Trial</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year +</option>
                  </select>
                </div>

                {/* Number of Occupants */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Number of Guests</label>
                  <select
                    name="numberOccupants"
                    value={formData.numberOccupants}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                  >
                    <option value={1}>1 Resident (Self)</option>
                    <option value={2}>2 Residents (Sisters/Friends)</option>
                    <option value={3}>3 Residents (Group booking)</option>
                  </select>
                </div>

                {/* Special Requirements */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#4A3B5F] block uppercase tracking-wider">Special Requirements / Dietary Preferences</label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="E.g., Prefers lower floor, Red Rice meal choice, needs early morning hot water, roommate preferences..."
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-xs sm:text-sm text-[#4A3B5F] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#967BB6]/20 transition-all"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Form Action submit bar */}
          <div className="bg-white/40 border-t border-white/40 p-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-[#6B5B8E] font-semibold text-center sm:text-left leading-relaxed max-w-md">
              By clicking Submit, you request review by the resident warden under zero-obligation rules.
            </span>
            <button
              type="submit"
              id="booking-submit-btn"
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#c49f2c] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Submit Application
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
