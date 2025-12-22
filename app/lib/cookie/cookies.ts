// app/lib/cookies.ts
import Cookies from 'js-cookie';

export const getCookieConsent = () => {
  if (typeof window === 'undefined') return null;
  const consent = Cookies.get('cookie_consent');
  return consent ? JSON.parse(consent) : null;
};

export const hasConsent = (type: string) => {
  const consent = getCookieConsent();
  return consent ? consent[type] : false;
};

// Add any cookie-related utility functions here