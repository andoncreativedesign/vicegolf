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
      {/* Global Newsletter Section — exact 1:1 vicegolf.com match */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '64px 16px 56px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'normal',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#111111',
            margin: '0 0 10px',
            fontFamily: "'Poppins-Bold', sans-serif",
            lineHeight: 1.2,
          }}>
            JOIN OUR NEWSLETTER!
          </h2>
          <p style={{
            fontSize: '15px',
            fontWeight: 400,
            color: '#555555',
            margin: '0 0 24px',
            lineHeight: 1.5,
            fontFamily: "'Inter-Regular', 'Inter', sans-serif",
            textDecoration: 'none',
          }}>
            <span style={{ color: '#555555', textDecoration: 'none' }}>
              Unlock exclusive benefits, receive promo codes and access special perks as a subscriber.
            </span>
          </p>
          <NewsletterForm />
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
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
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

  const handleFocus = () => {
    if (!hasTrackedFormStart.current) {
      hasTrackedFormStart.current = true;
      globalNewsletterTrack.formStart('global_footer');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      globalNewsletterTrack.invalidEmail('global_footer');
      if (nameInputRef.current) {
        nameInputRef.current.setCustomValidity('Please fill out this field.');
        nameInputRef.current.reportValidity();
      }
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      globalNewsletterTrack.invalidEmail('global_footer');
      if (emailInputRef.current) {
        if (!trimmedEmail) {
          emailInputRef.current.setCustomValidity('Please fill out this field.');
        } else if (!trimmedEmail.includes('@')) {
          emailInputRef.current.setCustomValidity(`Please include an '@' in the email address. '${trimmedEmail}' is missing an '@'.`);
        } else if (!trimmedEmail.includes('.')) {
          emailInputRef.current.setCustomValidity('Please enter a valid email address with a domain.');
        } else {
          emailInputRef.current.setCustomValidity('Please enter a valid email address.');
        }
        emailInputRef.current.reportValidity();
      }
      return;
    }

    // Fire submit attempt right as button is clicked
    globalNewsletterTrack.submitAttempt('global_footer');
    setIsManualSubmitting(true);
    setManualResult(null);

    try {
      const formData = new FormData();
      formData.append('name', trimmedName);
      formData.append('email', trimmedEmail);

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
        globalNewsletterTrack.invalidEmail('global_footer');
        if (emailInputRef.current) {
          emailInputRef.current.setCustomValidity(data?.error || 'Failed to subscribe. Please try again.');
          emailInputRef.current.reportValidity();
        }
      }
    } catch (err: any) {
      setIsManualSubmitting(false);
      globalNewsletterTrack.invalidEmail('global_footer');
      if (emailInputRef.current) {
        emailInputRef.current.setCustomValidity(err.message || 'Network error. Please try again.');
        emailInputRef.current.reportValidity();
      }
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
        if (emailInputRef.current) {
          emailInputRef.current.setCustomValidity(fetcher.data.error);
          emailInputRef.current.reportValidity();
        }
      }
    }
  }, [fetcher.data]);

  return (
    <div style={{ width: '100%', maxWidth: '390px', margin: '0 auto' }}>
      <style>{`
        .vice-newsletter-input::placeholder {
          color: #666666 !important;
          opacity: 1 !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          font-family: 'Inter-Regular', 'Inter', sans-serif !important;
        }
      `}</style>
      {isSuccess ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          backgroundColor: '#111111',
          color: '#ffffff',
          borderRadius: '9999px',
          height: '42px',
          padding: '0 24px',
        }}>
          <CheckCircle2 style={{ width: 16, height: 16, color: '#34d399', flexShrink: 0 }} />
          <span style={{ fontWeight: 600, fontSize: '14px', fontFamily: "'Inter-Regular', 'Inter', sans-serif" }}>
            {fetcher.data?.message || manualResult?.message || 'Thank you for subscribing!'}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#e2e2e2',
            borderRadius: '9999px',
            height: '42px',
            padding: '0 0 0 18px',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}>
            {/* Name Input */}
            <input
              ref={nameInputRef}
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                e.target.setCustomValidity('');
              }}
              onFocus={handleFocus}
              placeholder="Your name"
              disabled={isSubmitting}
              autoComplete="given-name"
              className="vice-newsletter-input"
              style={{
                width: '88px',
                flexShrink: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                fontSize: '14px',
                fontWeight: 400,
                color: '#111111',
                fontFamily: "'Inter-Regular', 'Inter', sans-serif",
                padding: '0',
                height: '100%',
              }}
            />

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '16px',
              backgroundColor: '#b0b0b0',
              flexShrink: 0,
              margin: '0 10px',
            }} />

            {/* Email Input */}
            <input
              ref={emailInputRef}
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                e.target.setCustomValidity('');
              }}
              onFocus={handleFocus}
              placeholder="Type in your email"
              disabled={isSubmitting}
              autoComplete="email"
              className="vice-newsletter-input"
              style={{
                flex: '1 1 auto',
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                fontSize: '14px',
                fontWeight: 400,
                color: '#111111',
                fontFamily: "'Inter-Regular', 'Inter', sans-serif",
                padding: '0 8px 0 0',
                height: '100%',
              }}
            />

            {/* Submit button — wide capsule button capping right end of pill */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="Subscribe to newsletter"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSubmitting ? '#444444' : '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                height: '42px',
                width: '84px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s ease',
                padding: 0,
                margin: 0,
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2b2b2b';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#111111';
              }}
            >
              {isSubmitting ? (
                <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
              ) : (
                <svg width="17" height="14" viewBox="0 0 17 14" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="7" x2="15" y2="7" />
                  <polyline points="9.5 2 15 7 9.5 12" />
                </svg>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}



