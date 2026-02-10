import { Suspense } from 'react';
import { useState } from 'react';
import { Await, NavLink } from 'react-router';
// import { ArrowRight } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaLinkedinIn, FaPinterestP } from "react-icons/fa";

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


  // const [email, setEmail] = useState('');
  // const [isSubmitted, setIsSubmitted] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle form submission here
  //   console.log('Submitted email:', email);
  //   // Show success message
  //   setIsSubmitted(true);
  //   // Clear the input field
  //   setEmail('');
  //   // Reset the success message after 5 seconds
  //   setTimeout(() => {
  //     setIsSubmitted(false);
  //   }, 5000);
  // };
  return (
    <footer className="bg-white">
      {/* Modern Newsletter Section - Commented Out */}
      {/* <div className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-light tracking-wide text-gray-900 sm:text-4xl uppercase">
              JOIN OUR NEWSLETTER!
            </h2>
            <p className="mt-2 text-base text-gray-600">
              Unlock exclusive benefits, receive promo codes and access special perks as a subscriber.
            </p>
            <div className="mt-6 flex justify-center">
              <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Type in your email"
                    className="w-full px-8 py-5 pr-56 bg-gray-200 text-gray-800 placeholder-gray-500 text-base focus:outline-none focus:ring-0 border-0"
                    style={{ borderRadius: '50px', height: '60px' }}
                    required
                  />
                  <button
                    type="submit"
                    className="absolute top-1/2 -translate-y-1/2 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
                    style={{ 
                      borderRadius: '50px',
                      right: '4px',
                      height: '52px',
                      width: '180px'
                    }}
                  >
                    <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
                  </button>
                </div>
                <div className="h-6 mt-2">
                  {isSubmitted && (
                    <p className="text-green-500 text-sm text-center">
                      Thank you for subscribing!
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

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
})  {
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
         <button  onClick={() => toggleSection('help')}
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
            <li><NavLink to="/return-policy" className="!text-white hover:!text-gray-100 transition-colors"style={{ textDecoration: 'none' }}>Returns Policy</NavLink></li>
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
            <a href="https://www.instagram.com/vicegolf" className="!text-white hover:!text-gray-300 transition-colors">
              <FaInstagram className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.facebook.com/vicegolf" className="!text-white hover:!text-gray-300 transition-colors">
              <FaFacebookF className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.tiktok.com/@vicegolfofficial" className="!text-white hover:!text-gray-300 transition-colors">
              <FaTiktok className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.youtube.com/user/vicegolf" className="!text-white hover:!text-gray-300 transition-colors">
              <FaYoutube className="w-6 h-6 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="https://www.linkedin.com/company/vice-sporting-goods-gmbh" className="!text-white hover:!text-gray-300 transition-colors">
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


