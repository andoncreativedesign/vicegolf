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

  useEffect(() => {
    const savedConsent = Cookies.get(COOKIE_NAME);
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
    } else {
      setShowBanner(true);
    }
  }, []);

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent = { ...consent, ...newConsent };
    setConsent(updatedConsent);
    Cookies.set(COOKIE_NAME, JSON.stringify(updatedConsent), { expires: 365 });
    setShowBanner(false);

    // Here you can initialize/remove tracking scripts based on consent
    if (updatedConsent.analytics) {
      // Initialize analytics
    } else {
      // Remove analytics
    }
  };

  return (
    <CookieContext.Provider
      value={{ consent, updateConsent, showBanner, showPreferences, setShowPreferences }}
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