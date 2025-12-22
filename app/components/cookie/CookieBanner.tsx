// app/components/cookie/CookieBanner.tsx
import { useCookieConsent } from '~/contexts/CookieConsentContext';

export function CookieBanner() {
  const { showBanner, updateConsent, setShowPreferences } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 md:p-6 z-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <h3 className="text-lg font-medium text-gray-900 mb-2">We value your privacy</h3>
          <p className="text-sm text-gray-600">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => updateConsent({
              personalization: true,
              marketing: true,
              analytics: true
            })}
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800"
          >
            Accept All
          </button>
          <button
            onClick={() => updateConsent({
              personalization: false,
              marketing: false,
              analytics: false
            })}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
          >
            Decline
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Preferences
          </button>
        </div>
      </div>
    </div>
  );
}