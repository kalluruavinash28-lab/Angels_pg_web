/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';

// Pages
import { Home } from './pages/Home';
import { Rooms } from './pages/Rooms';
import { RoomDetail } from './pages/RoomDetail';
import { Facilities } from './pages/Facilities';
import { FoodMenuPage } from './pages/FoodMenuPage';
import { BookingPage } from './pages/BookingPage';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  // Detect secret admin/warden query param to show hidden warden portal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('warden') === 'true' || params.get('reset-password') === 'true') {
      setCurrentView('admin');
      // Clean query parameters from URL to keep it hidden
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [setCurrentView]);

  // Scroll to top on page transition for excellent SPA experience
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [currentView]);

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'rooms':
        return <Rooms />;
      case 'room-detail':
        return <RoomDetail />;
      case 'facilities':
        return <Facilities />;
      case 'menu':
        return <FoodMenuPage />;
      case 'book':
        return <BookingPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F4FF] font-sans text-[#4A3B5F] antialiased selection:bg-[#967BB6]/20 selection:text-[#4A3B5F] relative overflow-x-hidden">
      {/* Decorative blurred background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E6E6FA] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#D4AF37] opacity-20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Navigation */}
        <Header />

        {/* Main Content Stage */}
        <main className="flex-grow">
          {renderActiveView()}
        </main>

        {/* Footer Details */}
        <Footer />
      </div>

      {/* Interactive visual simulated notification gateway */}
      <WhatsAppSimulator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

