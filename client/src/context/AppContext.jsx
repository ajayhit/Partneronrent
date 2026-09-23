import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchServices, fetchSettings } from '../utils/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [services, setServices] = useState([
    { id: 'movie-companion', name: 'Movie Companion', basePrice: 2000, icon: 'Film', tagline: 'Watch latest releases together', description: 'Never watch a premiere alone.' },
    { id: 'in-person-hangout', name: 'Cafe & Conversation', basePrice: 1500, icon: 'Coffee', tagline: 'Meaningful chats over coffee', description: 'Unwind over coffee at your favorite cafe.' },
    { id: 'shopping-buddy', name: 'Shopping Buddy', basePrice: 1200, icon: 'ShoppingBag', tagline: 'Style advice & mall companion', description: 'Get honest styling feedback during shopping.' },
    { id: 'travel-partner', name: 'City Exploration & Travel', basePrice: 2500, icon: 'Compass', tagline: 'Explore monuments & food tours', description: 'Explore city landmarks with a friendly local.' },
    { id: 'elder-care', name: 'Elder Companionship', basePrice: 1000, icon: 'HeartHandshake', tagline: 'Park walks & gentle conversation', description: 'Patient companionship for senior citizens.' },
    { id: 'medical-support', name: 'Clinic & Medical Support', basePrice: 1500, icon: 'Stethoscope', tagline: 'Clinic appointment companion', description: 'Never face stressful doctor appointments alone.' },
    { id: 'clubbing-events', name: 'Events & Clubbing', basePrice: 2000, icon: 'Sparkles', tagline: 'Concerts, art exhibitions & gigs', description: 'A reliable plus-one for events.' },
    { id: 'consultation', name: 'Emotional Wellness Talk', basePrice: 1000, icon: 'Smile', tagline: 'Empathetic peer listening session', description: 'Stress relief through safe conversation.' }
  ]);
  const [settings, setSettings] = useState({
    platformName: 'PartnerOnRent',
    commissionRate: 20,
    gstRate: 18,
    supportPhone: '+91-98105-35398',
    cities: ['Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Jaipur']
  });

  // Admin active tab
  const [adminActiveTab, setAdminActiveTab] = useState('overview');

  // Global modals
  const [bookingModal, setBookingModal] = useState({ isOpen: false, partner: null, preselectedService: null });
  const [chatDrawer, setChatDrawer] = useState({ isOpen: false, booking: null });
  const [sosModal, setSosModal] = useState({ isOpen: false, booking: null });
  const [reviewModal, setReviewModal] = useState({ isOpen: false, booking: null });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const [svcData, setsData] = await Promise.all([fetchServices(), fetchSettings()]);
      if (svcData) setServices(svcData);
      if (setsData) setSettings(setsData);
    } catch (err) {
      console.warn('Backend loading default fallback:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        services,
        setServices,
        settings,
        setSettings,
        bookingModal,
        setBookingModal,
        openBookingModal: (partner, preselectedService = null) =>
          setBookingModal({ isOpen: true, partner, preselectedService }),
        closeBookingModal: () => setBookingModal({ isOpen: false, partner: null, preselectedService: null }),
        chatDrawer,
        openChat: (booking) => setChatDrawer({ isOpen: true, booking }),
        closeChat: () => setChatDrawer({ isOpen: false, booking: null }),
        sosModal,
        openSOS: (booking) => setSosModal({ isOpen: true, booking }),
        closeSOS: () => setSosModal({ isOpen: false, booking: null }),
        reviewModal,
        openReview: (booking) => setReviewModal({ isOpen: true, booking }),
        closeReview: () => setReviewModal({ isOpen: false, booking: null }),
        adminActiveTab,
        setAdminActiveTab,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
