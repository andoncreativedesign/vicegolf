// app/contexts/CookieConsentContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

type CookieConsent = {
  required: boolean;
  personalization: boolean;
  marketing: boolean;
  analytics: boolean;
};

type CookieContextType = {
  consent: CookieConsent;
  updateConsent: (newConsent: Partial<CookieConsent>) => void;
  showBanner: boolean;
  showPreferences: boolean;
  setShowPreferences: (show: boolean) => void;
};

const defaultConsent: CookieConsent = { 
  required: true,
  personalization: false,
  marketing: false,
  analytics: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const COOKIE_NAME = 'cookie_consent';

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // Debug mount state
  useEffect(() => {
    // console.log('Component mounted');
    setIsMounted(true);
    return () => {
      // console.log('Component unmounted');
      setIsMounted(false);
    };
  }, []);
  // Load cookie on mount
  useEffect(() => {
    try {
      const savedConsent = Cookies.get(COOKIE_NAME);
      // console.log('Raw cookie value:', savedConsent);

      if (savedConsent) {
        const parsed = JSON.parse(savedConsent);
        // console.log('Parsed cookie:', parsed);
        setConsent(parsed);
        setShowBanner(false);
      } else {
        // console.log('No saved cookie found');
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Error loading cookie:', error);
      setShowBanner(true);
    }
  }, []);
  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    // console.log('Updating consent with:', newConsent);
    const updatedConsent = { ...consent, ...newConsent };
    // console.log('Saving cookie:', updatedConsent);

    try {
      const cookieOptions = {
        expires: 365,
        sameSite: 'lax' as const,
        path: '/',
        secure: window.location.protocol === 'https:'
      };

      Cookies.set(COOKIE_NAME, JSON.stringify(updatedConsent), cookieOptions);
      setConsent(updatedConsent);
      setShowBanner(false);
    } catch (error) {
      console.error('Error saving cookie:', error);
    }
  };
  // Debug render
  // console.log('Render - showBanner:', showBanner, 'consent:', consent);
  return (
    <CookieContext.Provider
      value={{
        consent,
        updateConsent,
        showBanner,
        showPreferences,
        setShowPreferences
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}
export function useCookieConsent() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
}
