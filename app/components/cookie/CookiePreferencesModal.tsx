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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 text-[#1F1F1F]">
      <div className="bg-white rounded-sm shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="">

          <div className="flex justify-between items-center mb-6 w-full border-b-1 border-gray-700 pb-3">

            <div className='p-6'>
              <h1 className="text-2xl font-bold">Cookie preferences</h1>
              <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  className='px-6 py-2 border-2 border-[#606060] cursor-pointer rounded-none'
                  type="button"
                  onClick={handleDeclineAll}
                >
                  Decline all
                </button>
                <button
                  className='px-6 py-2 border-2 border-[#606060] cursor-pointer rounded-none'
                  type="button"
                  onClick={handleAcceptAll}
                >
                  Accept all
                </button>
                <button
                  className='px-6 py-2 border-2 border-[#606060] cursor-pointer rounded-none'
                  type="button"
                  onClick={handleSave}
                >
                  Save my choices
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowPreferences(false)}
              className="hover rounded-full p-1 border-2 border-white active:border-blue-400"
            >
              <X size={24} />
            </button>

          </div>

          <div className='border-b-1 border-gray-700 pb-3 p-6 mx-2'>
            <h2 className="font-semibold" style={{ lineHeight: '0.4px' }}>
              You control your data
            </h2>
            <p>
              Learn more about the cookies we use, and choose which cookies to allow.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* Required Cookies */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="required"
                  type="checkbox"
                  checked={true}
                  disabled
                  className="h-4 w-4 rounded text-black border-gray-300 focus:ring-black-500 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <h2 className="font-semibold text-base" style={{ lineHeight: '0.4' }}>
                  <label htmlFor="required">Required</label>
                </h2>
                <p className="">
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
                  className="h-4 w-4 rounded text-black border-gray-300 focus:ring-black-500 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <h2 className="font-semibold text-base" style={{ lineHeight: '0.4' }} >
                  <label htmlFor="personalization">Personalization</label>
                </h2>
                <p className="">
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
                  className="h-4 w-4 rounded text-black border-gray-300 focus:ring-black-500 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <h2 className="font-semibold text-base" style={{ lineHeight: '0.4' }}>
                  <label htmlFor="marketing">Marketing</label>
                </h2>
                <p className="">
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
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black-500 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <h2 className="font-semibold text-base" style={{ lineHeight: '0.4' }}>
                  <label htmlFor="analytics">Analytics</label>
                </h2>
                <p className="">
                  These cookies help us understand how you interact with the site. We use this data to identify areas to improve.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}