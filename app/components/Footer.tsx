import { Suspense } from 'react';
import { Await, NavLink } from 'react-router';
// import { ArrowRight } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaLinkedinIn, FaPinterestP } from "react-icons/fa";

import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';

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
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* About Column */}
        <div>
          <h3 className="font-semibold text-white mb-4">About</h3>
          <ul className="space-y-2">
            <li><NavLink to="/careers" className="!text-white hover:!text-gray-300 transition-colors">Career</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Blog</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Press Center</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">The Story of Vice Golf</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Vice x HIO Labs</NavLink></li>
          </ul>
        </div>

        {/* Help & Info Column */}
        <div>
          <h3 className="font-semibold text-white mb-4">Help & Info</h3>
          <ul className="space-y-2">
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Delivery & Shipping</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Refund Policy</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Store Locator</NavLink></li>
            <li><NavLink to="/return-policy" className="!text-white hover:!text-gray-300 transition-colors">Return Policy</NavLink></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h3 className="font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><NavLink to="/privacy-policy" className="!text-white hover:!text-gray-300 transition-colors">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms-of-service" className="!text-white hover:!text-gray-300 transition-colors">Terms of Service</NavLink></li>
            <li><NavLink to="/duties-taxes" className="!text-white hover:!text-gray-300 transition-colors">Duties & Taxes</NavLink></li>
            <li><NavLink to="/cookie-settings" className="!text-white hover:!text-gray-300 transition-colors">Cookie Settings</NavLink></li>
          </ul>
        </div>



        {/* Your Vice Golf Column */}
        <div>
          <h3 className="font-semibold text-white mb-4">Your Vice Golf</h3>
          <ul className="space-y-2">
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">eGift Cards</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">New Product Releases 2025</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Limited Editions</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Promo Codes</NavLink></li>
            <li><NavLink to="/" className="!text-white hover:!text-gray-300 transition-colors">Service & First Responder Discount</NavLink></li>
          </ul>
        </div>

        {/* Follow Us & Payment Info Column */}
        <div>
          <h3 className="font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-3 mb-6">
            <a href="/" className="!text-white hover:!text-gray-300 transition-colors">
              <FaInstagram className="w-5 h-5 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="/" className="!text-white hover:!text-gray-300 transition-colors">
              <FaFacebookF className="w-5 h-5 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="/" className="!text-white hover:!text-gray-300 transition-colors">
              <FaTiktok className="w-5 h-5 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="/" className="!text-white hover:!text-gray-300 transition-colors">
              <FaYoutube className="w-5 h-5 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="/" className="!text-white hover:!text-gray-300 transition-colors">
              <FaLinkedinIn className="w-5 h-5 !text-white" style={{ color: 'white !important' }} />
            </a>
            <a href="/" className="!text-white hover:!text-gray-300 transition-colors">
              <FaPinterestP className="w-5 h-5 !text-white" style={{ color: 'white !important' }} />
            </a>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-white mb-2">100% Safe Payment</h4>
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/visa.svg?v=1743711766&width=60&height=60&crop=center"
                alt="Visa"
                className="h-6 w-auto"
                loading="lazy"
              />
              <img
                src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/mastercard.svg?v=1743711766&width=60&height=60&crop=center"
                alt="Mastercard"
                className="h-6 w-auto"
                loading="lazy"
              />
              <img
                src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/american_express.svg?v=1743711767&width=60&height=60&crop=center"
                alt="American Express"
                className="h-6 w-auto"
                loading="lazy"
              />
              <img
                src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/paypal_1.svg?v=1743711766&width=60&height=60&crop=center"
                alt="PayPal"
                className="h-6 w-auto"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Safe & Fast Shipping</h4>
            <div className="flex items-center space-x-2">
              <img
                src='https://cdn.shopify.com/s/files/1/0732/0505/5640/files/logo.svg?v=1765342145'
                alt="Jeebly"
                className="h-8 w-auto"
                loading="lazy"
              />
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


