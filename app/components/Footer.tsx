import {Suspense, useState} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

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
      {/* Newsletter Section */}
      <NewsletterSection />
      
      {/* Main Footer */}
      <div className="bg-black text-white">
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

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Here you would integrate with your newsletter service (Klaviyo, Mailchimp, etc.)
    // For now, we'll just simulate a submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          JOIN OUR NEWSLETTER
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Unlock exclusive savings, receive early access to new arrivals, and discover insider tips to elevate your game.
        </p>
        
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type in your email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="bg-black text-white px-8 py-3 rounded-r-full hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
          >
            {isSubmitting ? '...' : 'Subscribe'}
          </button>
        </form>
        
        {isSuccess && (
          <p className="text-green-600 text-sm mt-4">
            Thank you for subscribing! Check your email for confirmation.
          </p>
        )}
      </div>
    </div>
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
            <li><NavLink to="/pages/about" className="text-gray-300 hover:text-white transition-colors">About</NavLink></li>
            <li><NavLink to="/blogs/news" className="text-gray-300 hover:text-white transition-colors">Blog</NavLink></li>
            <li><NavLink to="/pages/press-center" className="text-gray-300 hover:text-white transition-colors">Press Center</NavLink></li>
            <li><NavLink to="/pages/story" className="text-gray-300 hover:text-white transition-colors">The Story of Vice Golf</NavLink></li>
            <li><NavLink to="/pages/vice-link" className="text-gray-300 hover:text-white transition-colors">Vice's Link</NavLink></li>
          </ul>
        </div>

        {/* Help & Info Column */}
        <div>
          <h3 className="font-semibold text-white mb-4">Help & Info</h3>
          <ul className="space-y-2">
            <li><NavLink to="/pages/delivery-returns" className="text-gray-300 hover:text-white transition-colors">Delivery & Returns</NavLink></li>
            <li><NavLink to="/policies/refund-policy" className="text-gray-300 hover:text-white transition-colors">Refund Policy</NavLink></li>
            <li><NavLink to="/pages/size-guide" className="text-gray-300 hover:text-white transition-colors">Size Guide</NavLink></li>
          </ul>
        </div>

        {/* Legal Column - Uses Shopify footer menu if available */}
        <div>
          <h3 className="font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2">
            {footer?.menu?.items ? (
              footer.menu.items.map((item) => {
                if (!item.url) return null;
                const url = item.url.includes('myshopify.com') || 
                           item.url.includes(publicStoreDomain) || 
                           item.url.includes(header.shop.primaryDomain?.url || '')
                  ? new URL(item.url).pathname
                  : item.url;
                
                return (
                  <li key={item.id}>
                    <NavLink to={url} className="text-gray-300 hover:text-white transition-colors">
                      {item.title}
                    </NavLink>
                  </li>
                );
              })
            ) : (
              <>
                <li><NavLink to="/policies/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</NavLink></li>
                <li><NavLink to="/policies/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</NavLink></li>
                <li><NavLink to="/policies/refund-policy" className="text-gray-300 hover:text-white transition-colors">Refund Policy</NavLink></li>
                <li><NavLink to="/policies/shipping-policy" className="text-gray-300 hover:text-white transition-colors">Shipping Policy</NavLink></li>
              </>
            )}
          </ul>
        </div>

        {/* Your Vice Golf Column */}
        <div>
          <h3 className="font-semibold text-white mb-4">Your Vice Golf</h3>
          <ul className="space-y-2">
            <li><NavLink to="/account" className="text-gray-300 hover:text-white transition-colors">My Account</NavLink></li>
            <li><NavLink to="/pages/product-releases" className="text-gray-300 hover:text-white transition-colors">New Product Releases 2025</NavLink></li>
            <li><NavLink to="/pages/fitting-guide" className="text-gray-300 hover:text-white transition-colors">Fitting Guide</NavLink></li>
            <li><NavLink to="/pages/service-registration" className="text-gray-300 hover:text-white transition-colors">Service & Club Registration Services</NavLink></li>
          </ul>
        </div>

        {/* Follow Us & Payment Info Column */}
        <div>
          <h3 className="font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-3 mb-6">
            <a href="https://instagram.com/vicegolf" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://facebook.com/vicegolf" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@vicegolf" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>
            <a href="https://youtube.com/vicegolf" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://pinterest.com/vicegolf" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </a>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-white mb-2">100% Safe Payment</h4>
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
              <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
              <div className="w-8 h-5 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Safe & Fast Shipping</h4>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-4 bg-yellow-600 rounded"></div>
              <span className="text-gray-300 text-sm">DHL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 text-sm mb-4 md:mb-0">
          © 2025 {header.shop.name || 'Vice Sporting Goods, Inc'}. All Rights Reserved.
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">🇺🇸 United States (USD $)</span>
          </div>
        </div>
      </div>
    </div>
  );
}


