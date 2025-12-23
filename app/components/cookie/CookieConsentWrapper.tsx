// app/components/CookieConsentWrapper.tsx
'use client';

import { CookieProvider } from '~/contexts/CookieConsentContext';
import { CookieBanner } from './CookieBanner';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export function CookieConsentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CookieProvider>
      {children}
      <CookieBanner />
      <CookiePreferencesModal />
    </CookieProvider>
  );
}