/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Booking, Facility, FoodDay, RoomType, Review } from '../types';
import { INITIAL_ROOMS, INITIAL_FACILITIES, INITIAL_FOOD_MENU, INITIAL_TODAYS_SPECIAL, INITIAL_REVIEWS } from '../initialData';

interface AppContextProps {
  rooms: Room[];
  bookings: Booking[];
  facilities: Facility[];
  foodMenu: FoodDay[];
  todaysSpecial: string;
  permanentItems: string;
  currentView: 'home' | 'rooms' | 'room-detail' | 'facilities' | 'menu' | 'book' | 'admin';
  selectedRoomId: string | null;
  isOwnerLoggedIn: boolean;
  reviews: Review[];
  
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
  setFoodMenu: React.Dispatch<React.SetStateAction<FoodDay[]>>;
  setTodaysSpecial: (val: string) => void;
  setPermanentItems: (val: string) => void;
  setCurrentView: (view: 'home' | 'rooms' | 'room-detail' | 'facilities' | 'menu' | 'book' | 'admin') => void;
  setSelectedRoomId: (id: string | null) => void;
  
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  
  addFacility: (facility: Omit<Facility, 'id'>) => void;
  updateFoodMenu: (menu: FoodDay[]) => void;
  
  addBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'bookingDate'>) => Booking;
  approveBooking: (id: string) => Booking | null;
  rejectBooking: (id: string) => void;
  markRoomStatus: (id: string, status: 'Available' | 'Fully Booked') => void;
  
  loginOwner: (password: string) => boolean;
  loginWarden: (email: string, password: string) => boolean;
  logoutOwner: () => void;
  changeWardenPassword: (newPassword: string) => void;
  sendPasswordResetLink: () => void;
  sendAccessVerificationCode: () => void;
  wardenEmail: string;

  addReview: (review: Omit<Review, 'id'>) => void;
  deleteReview: (id: string) => void;

  recentNotification: {
    show: boolean;
    customerName: string;
    whatsAppNumber: string;
    roomType: string;
    checkInDate: string;
    rent: number;
    messageText: string;
  } | null;
  clearNotification: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or fallback
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('angels_pg_rooms');
    let loadedRooms: Room[] = saved ? JSON.parse(saved) : INITIAL_ROOMS;
    
    // Auto-migrate prices if they are old mock values to prevent mismatched states
    loadedRooms = loadedRooms.map(room => {
      if (room.id === 'room-1' && (room.rent === 15000 || room.images[0].includes('assets/images'))) {
        return { 
          ...room, 
          rent: 11000, 
          deposit: 11000,
          images: [
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
          ]
        };
      }
      if (room.id === 'room-2' && (room.rent === 9500 || room.images[0].includes('assets/images'))) {
        return { 
          ...room, 
          rent: 6500, 
          deposit: 6500,
          images: [
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
          ]
        };
      }
      if (room.id === 'room-3' && room.rent === 7500) {
        return { ...room, rent: 5500, deposit: 5500 };
      }
      return room;
    });
    
    return loadedRooms;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('angels_pg_bookings');
    // Pre-populate with a couple of mock bookings for demo purposes if empty
    if (saved) return JSON.parse(saved);
    
    const mockBookings: Booking[] = [
      {
        id: 'booking-mock-1',
        fullName: 'Priya Sharma',
        mobileNumber: '9876543210',
        whatsAppNumber: '9876543210',
        email: 'priya.sharma@gmail.com',
        collegeOrCompany: 'PES University',
        occupation: 'Student',
        gender: 'Female',
        address: 'Sector 4, HSR Layout, Bangalore',
        idProofType: 'Aadhaar Card',
        preferredRoomType: 'Double',
        checkInDate: '2026-08-01',
        expectedStayDuration: '6 Months',
        numberOccupants: 1,
        specialRequirements: 'Prefers red rice for lunch, close to lift.',
        status: 'Pending',
        bookingDate: '2026-07-18 14:32'
      },
      {
        id: 'booking-mock-2',
        fullName: 'Anjali Nair',
        mobileNumber: '8123456789',
        whatsAppNumber: '8123456789',
        email: 'anjali.n@tcs.com',
        collegeOrCompany: 'Tata Consultancy Services',
        occupation: 'Employee',
        gender: 'Female',
        address: 'Cochin, Kerala',
        idProofType: 'Passport',
        preferredRoomType: 'Single',
        checkInDate: '2026-07-25',
        expectedStayDuration: '1 Year',
        numberOccupants: 1,
        specialRequirements: 'Needs High-Speed WiFi for remote work.',
        status: 'Confirmed',
        bookingDate: '2026-07-15 10:15'
      }
    ];
    return mockBookings;
  });

  const [facilities, setFacilities] = useState<Facility[]>(() => {
    const saved = localStorage.getItem('angels_pg_facilities');
    return saved ? JSON.parse(saved) : INITIAL_FACILITIES;
  });

  const [foodMenu, setFoodMenu] = useState<FoodDay[]>(() => {
    const saved = localStorage.getItem('angels_pg_food_menu');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_MENU;
  });

  const [todaysSpecial, setTodaysSpecialState] = useState<string>(() => {
    return localStorage.getItem('angels_pg_todays_special') || INITIAL_TODAYS_SPECIAL;
  });

  const [permanentItems, setPermanentItemsState] = useState<string>(() => {
    return localStorage.getItem('angels_pg_permanent_items') || 'Daily Tea & Coffee, Warm Drinking Water (24/7), Pure Hot Milk, Curd, Homemade Pickles';
  });

  const [currentView, setCurrentView] = useState<'home' | 'rooms' | 'room-detail' | 'facilities' | 'menu' | 'book' | 'admin'>('home');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('angels_pg_owner_logged_in') === 'true';
  });

  const wardenEmail = 'kalluruavinash28@gmail.com';
  const [wardenPassword, setWardenPassword] = useState<string>(() => {
    return localStorage.getItem('angels_pg_warden_password') || '@Avi@2811';
  });

  useEffect(() => {
    localStorage.setItem('angels_pg_warden_password', wardenPassword);
  }, [wardenPassword]);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('angels_pg_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Simulator notification state
  const [recentNotification, setRecentNotification] = useState<AppContextProps['recentNotification']>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('angels_pg_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('angels_pg_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('angels_pg_facilities', JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem('angels_pg_food_menu', JSON.stringify(foodMenu));
  }, [foodMenu]);

  useEffect(() => {
    localStorage.setItem('angels_pg_todays_special', todaysSpecial);
  }, [todaysSpecial]);

  useEffect(() => {
    localStorage.setItem('angels_pg_permanent_items', permanentItems);
  }, [permanentItems]);

  useEffect(() => {
    localStorage.setItem('angels_pg_owner_logged_in', isOwnerLoggedIn ? 'true' : 'false');
  }, [isOwnerLoggedIn]);

  useEffect(() => {
    localStorage.setItem('angels_pg_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const setTodaysSpecial = (val: string) => {
    setTodaysSpecialState(val);
  };

  const setPermanentItems = (val: string) => {
    setPermanentItemsState(val);
  };

  const clearNotification = () => {
    setRecentNotification(null);
  };

  // Rooms CRUD
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  // Facilities
  const addFacility = (facilityData: Omit<Facility, 'id'>) => {
    const newFacility: Facility = {
      ...facilityData,
      id: `facility-${Date.now()}`
    };
    setFacilities(prev => [...prev, newFacility]);
  };

  // Food Menu
  const updateFoodMenu = (newMenu: FoodDay[]) => {
    setFoodMenu(newMenu);
  };

  // Bookings
  const addBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'bookingDate'>) => {
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      status: 'Pending',
      bookingDate: dateStr
    };
    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const approveBooking = (id: string) => {
    let targetBooking: Booking | null = null;
    
    setBookings(prev => {
      return prev.map(b => {
        if (b.id === id) {
          targetBooking = { ...b, status: 'Confirmed' };
          return targetBooking;
        }
        return b;
      });
    });

    if (targetBooking) {
      const confirmedBooking = targetBooking as Booking;
      // Fetch rent for preferredRoomType or exact room linked
      const matchingRoom = rooms.find(r => r.type === confirmedBooking.preferredRoomType);
      const rentAmount = matchingRoom ? matchingRoom.rent : (confirmedBooking.preferredRoomType === 'Single' ? 11000 : confirmedBooking.preferredRoomType === 'Double' ? 6500 : 5500);

      // Construct WhatsApp message template as requested:
      const msg = `Hello ${confirmedBooking.fullName},

Your booking at Angels PG for Ladies has been confirmed.

Room Type: ${confirmedBooking.preferredRoomType} Sharing
Check-in Date: ${confirmedBooking.checkInDate}
Monthly Rent: ₹${rentAmount}

Address:
Angels PG for Ladies
3rd Cross, Anand Reddy Layout, Shanthipura

Contact:
📞 8074494420
📞 7207174230

Thank you for choosing Angels PG.`;

      // Set simulation notification to display inside the UI beautifully!
      setRecentNotification({
        show: true,
        customerName: confirmedBooking.fullName,
        whatsAppNumber: confirmedBooking.whatsAppNumber,
        roomType: confirmedBooking.preferredRoomType,
        checkInDate: confirmedBooking.checkInDate,
        rent: rentAmount,
        messageText: msg
      });
    }

    return targetBooking;
  };

  const rejectBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Rejected' } : b));
  };

  const markRoomStatus = (id: string, status: 'Available' | 'Fully Booked') => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  // Admin Auth
  const loginOwner = (password: string) => {
    // Simple secure password "angels123" for owner login
    if (password === 'angels123' || password === wardenPassword) {
      setIsOwnerLoggedIn(true);
      return true;
    }
    return false;
  };

  const loginWarden = (email: string, password: string) => {
    if (email.trim().toLowerCase() === wardenEmail.toLowerCase() && (password === wardenPassword || password === '@Avi@2811')) {
      setIsOwnerLoggedIn(true);
      return true;
    }
    return false;
  };

  const changeWardenPassword = (newPassword: string) => {
    setWardenPassword(newPassword);
  };

  const sendPasswordResetLink = () => {
    // Construct nice simulated notification inside app
    const resetUrl = `${window.location.origin}/?reset-password=true`;
    console.log(`[SIMULATION] Sending password reset link: ${resetUrl} to ${wardenEmail}`);
    setRecentNotification({
      show: true,
      customerName: "Warden (Self)",
      whatsAppNumber: "8074494420",
      roomType: "System Notification",
      checkInDate: "Immediate",
      rent: 0,
      messageText: `✉️ PASSWORD RESET LINK SENT TO ${wardenEmail}:
      
Dear Warden,

Please click the link below or enter verification to reset your warden portal access password:
${resetUrl}

Default Password: @Avi@2811
Current Password: ${wardenPassword}`
    });
  };

  const sendAccessVerificationCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SIMULATION] Sending access verification code: ${code} to ${wardenEmail}`);
    setRecentNotification({
      show: true,
      customerName: "Warden (Self)",
      whatsAppNumber: "8074494420",
      roomType: "System Verification",
      checkInDate: "Immediate",
      rent: 0,
      messageText: `🛡️ SECURITY VERIFICATION SENT TO ${wardenEmail}:
      
Dear Warden,

A security action or login change was requested for the Warden Portal.
Your 6-digit access verification code is: ${code}

Please do not share this code with anyone.`
    });
  };

  const logoutOwner = () => {
    setIsOwnerLoggedIn(false);
  };

  const addReview = (reviewData: Omit<Review, 'id'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <AppContext.Provider value={{
      rooms,
      bookings,
      facilities,
      foodMenu,
      todaysSpecial,
      permanentItems,
      currentView,
      selectedRoomId,
      isOwnerLoggedIn,
      reviews,
      
      setRooms,
      setBookings,
      setFacilities,
      setFoodMenu,
      setTodaysSpecial,
      setPermanentItems,
      setCurrentView,
      setSelectedRoomId,
      
      addRoom,
      updateRoom,
      deleteRoom,
      
      addFacility,
      updateFoodMenu,
      
      addBooking,
      approveBooking,
      rejectBooking,
      markRoomStatus,
      
      loginOwner,
      loginWarden,
      logoutOwner,
      changeWardenPassword,
      sendPasswordResetLink,
      sendAccessVerificationCode,
      wardenEmail,

      addReview,
      deleteReview,

      recentNotification,
      clearNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
