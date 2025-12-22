// app/components/cookie/CookiePreferencesModal.tsx
import { useState, useEffect } from 'react';
import { useCookieConsent } from '~/contexts/CookieConsentContext';
import { X } from 'lucide-react';

export function CookiePreferencesModal() {
  const { consent, updateConsent, showPreferences, setShowPreferences } = useCookieConsent();
  const [localConsent, setLocalConsent] = useState(consent);

  useEffect(() => {
    setLocalConsent(consent);
  }, [consent, showPreferences]);

  if (!showPreferences) return null;

  const handleSave = () => {
    updateConsent(localConsent);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    updateConsent({
      personalization: true,
      marketing: true,
      analytics: true
    });
    setShowPreferences(false);
  };

  const handleDeclineAll = () => {
    updateConsent({
      personalization: false,
      marketing: false,
      analytics: false
    });
    setShowPreferences(false);
  };

  return (
    // <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Cookie preferences</h2>
            <button
              onClick={() => setShowPreferences(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <p className="mb-6 text-gray-600">
            You control your data. Choose which cookies you allow us to use.
          </p>

          <div className="space-y-6">
            {/* Required Cookies */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="required"
                  type="checkbox"
                  checked={true}
                  disabled
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="required" className="font-medium text-gray-700">
                  Required
                </label>
                <p className="text-gray-500">
                  These cookies are necessary for the site to function properly, including capabilities like logging in and adding items to the cart.
                </p>
              </div>
            </div>

            {/* Personalization Cookies */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="personalization"
                  type="checkbox"
                  checked={localConsent.personalization}
                  onChange={(e) => setLocalConsent({ ...localConsent, personalization: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="personalization" className="font-medium text-gray-700">
                  Personalization
                </label>
                <p className="text-gray-500">
                  These cookies store details about your actions to personalize your next visit to the website.
                </p>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketing"
                  type="checkbox"
                  checked={localConsent.marketing}
                  onChange={(e) => setLocalConsent({ ...localConsent, marketing: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="marketing" className="font-medium text-gray-700">
                  Marketing
                </label>
                <p className="text-gray-500">
                  These cookies are used to optimize marketing communications and show you ads on other sites.
                </p>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="analytics"
                  type="checkbox"
                  checked={localConsent.analytics}
                  onChange={(e) => setLocalConsent({ ...localConsent, analytics: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="analytics" className="font-medium text-gray-700">
                  Analytics
                </label>
                <p className="text-gray-500">
                  These cookies help us understand how you interact with the site. We use this data to identify areas to improve.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={handleDeclineAll}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Decline all
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save my choices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}