import { Suspense, useState, useEffect, useRef } from 'react';
import { Await, NavLink, useFetcher } from 'react-router';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import { globalNewsletterTrack } from '~/lib/analytics/newsletterEvents';

import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { useCookieConsent } from '~/contexts/CookieConsentContext';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <footer className="bg-white">
      {/* Global Newsletter Section */}
      <div className="bg-[#f9f9f9] border-t border-b border-gray-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl uppercase">
              JOIN OUR NEWSLETTER!
            </h2>
            <p className="mt-3 text-base text-gray-600 sm:text-lg">
              Unlock exclusive benefits, receive promo codes and access special perks as a subscriber.
            </p>

            <div className="mt-8 flex justify-center">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - No border top since newsletter is removed */}
      <div className="bg-black text-white pt-10">
        <Suspense>
          <Await resolve={footerPromise}>
            {(footer) => (
              <FooterContent
                footer={footer}
                header={header}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </footer>
  );
}


function FooterContent({
  footer,
  header,
  publicStoreDomain,
}: {
  footer: FooterQuery | null;
  header: HeaderQuery;
  publicStoreDomain: string;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    help: false,
    legal: false,
    follow: false
  });
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const { setShowPreferences } = useCookieConsent();


  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-between gap-6 md:text-left">
        {/* About Column */}
        {/* <div>
          <h3 className="font-semibold text-white mb-4">About</h3>
          <ul className="space-y-2 textDecoration-none">
            <li><NavLink to="/careers" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>Career</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>Blog</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>Press Center</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>The Story of Vice Golf</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>Vice x HIO Labs</NavLink></li>
          </ul>
        </div> */}

        {/* Help & Info Column */}
        <div className="border-b md:border-none border-gray-700 mb-4 md:mb-0">
          <button onClick={() => toggleSection('help')}
            className="flex justify-between items-center w-full py-3 md:py-0">
            <h3 className="font-semibold text-white ">Help & Info</h3>
            <svg className="w-4 h-4 lg:hidden text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`${openSections.help ? 'block' : 'hidden'} lg:block lg:mt-4`}>
            <ul className="space-y-2">
              {/* <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors"style={{ textDecoration: 'none' }}>Delivery & Shipping</NavLink></li> */}
              {/* <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors"style={{ textDecoration: 'none' }}>Refund Policy</NavLink></li> */}
              {/* <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Store Locator</NavLink></li> */}
              <li><NavLink to="/blog" className="!text-white hover:!text-gray-100 transition-colors" style={{ textDecoration: 'none' }}>Blog</NavLink></li>
              <li><NavLink to="/customs-guide" className="!text-white hover:!text-gray-100 transition-colors" style={{ textDecoration: 'none' }}>Customs Guide</NavLink></li>
            </ul>
            <p className="!text-white text-sm mt-2">For any queries,</p>
            <p>email us at    <a href="mailto:info@vgmesportstrading.com" className="underline !text-white">info@vgmesportstrading.com</a></p>
          </div>
        </div>

        {/* Legal Column */}
        <div className="border-b md:border-none border-gray-700 mb-4 md:mb-0">
          <button onClick={() => toggleSection('legal')}
            className="flex justify-between items-center w-full py-3 md:py-0">
            <h3 className="font-semibold text-white ">Legal</h3>
            <svg className="w-4 h-4 lg:hidden text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`${openSections.legal ? 'block' : 'hidden'} lg:block lg:mt-4`}>
            <ul className="space-y-2">
              <li><NavLink to="/terms-of-service" className="!text-white hover:!text-gray-100 transition-colors" style={{ textDecoration: 'none' }}>Terms of Service</NavLink></li>
              <li><NavLink to="/return-policy" className="!text-white hover:!text-gray-100 transition-colors" style={{ textDecoration: 'none' }}>Returns Policy</NavLink></li>
              <li><NavLink to="/privacy-policy" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>Privacy Policy</NavLink></li>
              <li>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="!text-white hover:!text-gray-300 transition-colors"
                  style={{ textDecoration: 'none' }}>
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Your Vice Golf Column */}
        {/* <div>
          <h3 className="font-semibold text-white mb-4">Your Vice Golf</h3>
          <ul className="space-y-2">
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>eGift Cards</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>New Product Releases 2025</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>Limited Editions</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>Promo Codes</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors" style={{ textDecoration: 'none' }}>Service & First Responder Discount</NavLink></li>
          </ul>
        </div> */}

        {/* Follow Us  */}
        <div>
          <h3 className="font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-3 mb-6">
            <a href="https://www.instagram.com/vicegolfme/" className="!text-white hover:!text-gray-300 transition-colors">
              <FaInstagram className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61581584603862" className="!text-white hover:!text-gray-300 transition-colors">
              <FaFacebookF className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.tiktok.com/@vicegolfofficial" className="!text-white hover:!text-gray-300 transition-colors">
              <FaTiktok className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.youtube.com/user/vicegolf" className="!text-white hover:!text-gray-300 transition-colors">
              <FaYoutube className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.linkedin.com/company/vicegolfme/" className="!text-white hover:!text-gray-300 transition-colors">
              <FaLinkedinIn className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.pinterest.de/vicegolf" className="!text-white hover:!text-gray-300 transition-colors">
              <FaPinterestP className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
          </div>
        </div>

        {/* Payment Info Column */}
        <div>
          <div className="mb-4">
            <h4 className="font-semibold text-white mb-2">100% Safe Payment</h4>
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/visa.svg?v=1743711766&width=60&height=60&crop=center"
                alt="Visa"
                className="h-8 w-auto "
                loading="lazy"
              />
              <img
                src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/mastercard.svg?v=1743711766&width=60&height=60&crop=center"
                alt="Mastercard"
                className="h-8 w-auto"
                loading="lazy"
              />
              {/* <img
                // src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/american_express.svg?v=1743711767&width=60&height=60&crop=center"
                src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=50&crop=center"
                alt="American Express"
                className="h-8 w-10 object-cover"
                loading="lazy"
              /> */}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Safe & Fast Shipping</h4>
            <div className="flex items-center space-x-4">
              <a href="https://jeebly.com/" aria-label="Jeebly Home">
                <img
                  src='https://cdn.shopify.com/s/files/1/0732/0505/5640/files/logo.svg?v=1765342145'
                  alt="Jeebly"
                  className="h-9 w-auto"
                  loading="lazy"
                />
              </a>
              <a href="https://asyad.om/" aria-label="asyad Home">
                <img
                  src='https://cdn.shopify.com/s/files/1/0732/0505/5640/files/asyad_logo.png?v=1768477591'
                  alt="asyad "
                  className="h-8 w-auto"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 text-sm mb-4 md:mb-0">
          © 2025 Vice Sporting Goods, Inc. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const fetcher = useFetcher<{
    success?: boolean;
    error?: string;
    message?: string;
    action?: string;
  }>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const hasTrackedFormStart = useRef(false);
  const prevDataRef = useRef(fetcher.data);

  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [manualResult, setManualResult] = useState<{
    success?: boolean;
    error?: string;
    message?: string;
  } | null>(null);

  const isSubmitting = fetcher.state === 'submitting' || isManualSubmitting;
  const isSuccess = (fetcher.data?.success === true) || (manualResult?.success === true);
  const errorMsg = fetcher.data?.error || manualResult?.error;

  const handleFocus = () => {
    if (!hasTrackedFormStart.current) {
      hasTrackedFormStart.current = true;
      globalNewsletterTrack.formStart('global_footer');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      globalNewsletterTrack.invalidEmail('global_footer');
      setManualResult({ error: 'Please enter your name.' });
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      globalNewsletterTrack.invalidEmail('global_footer');
      setManualResult({ error: 'Please enter a valid email address.' });
      return;
    }

    // Fire submit attempt right as button is clicked
    globalNewsletterTrack.submitAttempt('global_footer');
    setIsManualSubmitting(true);
    setManualResult(null);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());

      const res = await fetch('/api/newsletter', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setIsManualSubmitting(false);

      if (data?.success) {
        setManualResult({ success: true, message: data.message });
        globalNewsletterTrack.signupSuccess('global_footer');
        setName('');
        setEmail('');
      } else {
        setManualResult({ error: data?.error || 'Failed to subscribe. Please try again.' });
        globalNewsletterTrack.invalidEmail('global_footer');
      }
    } catch (err: any) {
      setIsManualSubmitting(false);
      setManualResult({ error: err.message || 'Network error. Please try again.' });
      globalNewsletterTrack.invalidEmail('global_footer');
    }
  };

  useEffect(() => {
    if (fetcher.data && fetcher.data !== prevDataRef.current) {
      prevDataRef.current = fetcher.data;

      if (fetcher.data.success) {
        // Fire successful signup event: { event: 'newsletter_signup', form_location: 'global_footer' }
        globalNewsletterTrack.signupSuccess('global_footer');
        setName('');
        setEmail('');
      } else if (fetcher.data.error) {
        globalNewsletterTrack.invalidEmail('global_footer');
      }
    }
  }, [fetcher.data]);

  return (
    <div className="w-full max-w-2xl">
      {isSuccess ? (
        <div className="bg-black text-white p-6 rounded-2xl flex items-center justify-center gap-3 shadow-md animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <p className="font-medium text-base sm:text-lg">
            {fetcher.data?.message || 'Thank you for subscribing to our newsletter!'}
          </p>
        </div>
      ) : (
        <fetcher.Form
          method="post"
          action="/api/newsletter"
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Name Input */}
            <div className="w-full sm:w-1/2">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={handleFocus}
                placeholder="Your Name"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-gray-200 text-gray-900 placeholder-gray-500 text-base rounded-full focus:outline-none focus:ring-2 focus:ring-black border-0 transition-all h-[56px]"
                required
              />
            </div>

            {/* Email Input + Arrow Submit Button */}
            <div className="w-full sm:w-1/2 relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleFocus}
                placeholder="Type in your email"
                disabled={isSubmitting}
                className="w-full px-6 py-4 pr-16 bg-gray-200 text-gray-900 placeholder-gray-500 text-base rounded-full focus:outline-none focus:ring-2 focus:ring-black border-0 transition-all h-[56px]"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Subscribe to newsletter"
                className="absolute top-1/2 -translate-y-1/2 right-1.5 bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center rounded-full h-[46px] w-[46px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center justify-center gap-2 text-rose-600 text-sm mt-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </fetcher.Form>
      )}
    </div>
  );
}



