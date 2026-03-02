import { Suspense, useEffect, useState } from 'react';
import { LuUser } from 'react-icons/lu';
import { Await, NavLink, useAsyncValue, useLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router';
import { type CartViewPayload, Image, useAnalytics, useOptimisticCart, } from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { debugMenuItems } from '~/utils/debug-menu';
import type { loader } from '~/root';
import Banner from './Banner';
import type { MenuData } from '~/lib/shopify/product-queries';
import type { BannerData } from '~/lib/sanity/home';
import DropdownItem from './Header/NavDropdownItem';
import HeaderMenu from './Header/HeaderMenu';

interface DropdownItem {
  name: string;
  href: string;
  image: string;
  description: string;
}

interface DropdownSection {
  title: string;
  items: DropdownItem[];
}

interface ProductDropdownItem {
  name: string;
  href: string;
  image: { id: string; altText: string; url: string; };
  description?: string;
}

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

// Function to transform collections into dropdown items
const transformCollectionsToDropdown = (collections: any[]): ProductDropdownItem[] => {
  const dropdowns = collections.map(item => {
    return {
      name: item.title,
      href: `/products/${item.handle}`,
      image: item.featuredImage,
      description: item?.description || ''
    }
  })
  return dropdowns;
};

// Country flag URLs
const flagUrls: Record<string, string> = {
  UAE: 'https://cdn.shopify.com/s/files/1/0732/0505/5640/files/WhatsApp_Image_2025-12-19_at_12.17.59_PM.jpg?v=1766127036&width=30&height=30&crop=center',
  // US: 'https://cdn.shopify.com/s/files/1/0832/9235/6897/files/united_states.svg?v=1708075042&width=40&height=40&crop=center',
  // CA: 'https://cdn.shopify.com/s/files/1/0832/9235/6897/files/canada.svg?v=1708075041&width=40&height=40&crop=center',
  // DE: 'https://cdn.shopify.com/s/files/1/0832/9235/6897/files/germany.svg?v=1708075042&width=40&height=40&crop=center',
  // CH: 'https://cdn.shopify.com/s/files/1/0832/9235/6897/files/switzerland.svg?v=1708075042&width=40&height=40&crop=center',
  // GB: 'https://cdn.shopify.com/s/files/1/0832/9235/6897/files/united_kingdom.svg?v=1708075042&width=40&height=40&crop=center',
  // SE: 'https://cdn.shopify.com/s/files/1/0832/9235/6897/files/sweden.svg?v=1712925748&width=40&height=40&crop=center'
};

// Then update the Header component
export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
  banner,
}: HeaderProps & { banner?: BannerData }) {
  // Debug log to check banner prop in Header

  const { shop, menu } = header;
  const { productsForNav } = useLoaderData<{ productsForNav: MenuData }>();
  // Get menu items from the productsForNav data
  const menuItems = productsForNav?.menu?.items[0]?.items || [];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleMenuNavigation = async () => {
    const isHomePage = window.location.pathname === '/';
    if (isHomePage) return; // Already on home page, do nothing

    try {
      setIsNavigating(true);
      await navigate('/');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // This will run after navigation completes or fails
      setIsNavigating(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 shadow-xs" style={{ width: '100%', margin: 0 }}>
      {/* Marquee Banner - Always Visible */}
      {banner && <Banner banner={banner} />}

      {/* Top Header Bar - Collapses on Scroll */}
      <div className={`flex items-center justify-between px-2 w-full transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 py-0 opacity-0' : 'py-3 h-auto opacity-100'}`}>
        {/* Left: Mobile Menu Toggle */}
        <div className="flex-1 flex items-center">
          <HeaderMenuMobileToggle />
          {/* Country selector is now only in the mobile menu */}
          <div className="hidden lg:block ml-4">
            <CountryCurrencySelector />
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex-none flex justify-center">
          {/* <NavLink prefetch="intent" to="/" className="flex items-center">
            <img src="/vice_logo.svg" alt="Vice Logo" className="h-8 md:h-12 w-auto" />
          </NavLink> */}
          <button
            className="flex items-center relative cursor-pointer"
            onClick={handleMenuNavigation}
            disabled={isNavigating}
          >
            <img
              src="/vice_logo.svg"
              alt="Vice Logo"
              className={`h-8 md:h-12 w-auto transition-opacity ${isNavigating ? 'opacity-50' : 'opacity-100'}`}
            />
            {isNavigating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
              </div>
            )}
          </button>
        </div>

        {/* Right: Icons */}
        <div className="flex-1 flex items-center justify-end space-x-2">
          <SearchToggle />
          <AccountToggle isLoggedIn={isLoggedIn} />
          <CartToggle cart={cart} />
        </div>
      </div>

      {/* Navigation Menu - Visible only on desktop */}
      <nav className="hidden lg:block w-full py-3">
        <div className="w-full px-2">
          {menuItems && <HeaderMenu viewport="desktop" menuItems={menuItems} />}
        </div>
      </nav>
    </header>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
      onClick={() => open('mobile')}
      aria-label="Open mobile menu"
    >
      <svg className="w-6 h-6 text-gray-700 hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <button
      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
      onClick={() => open('search')}
      aria-label="Search"
    >
      <svg className="w-6 h-6 text-gray-700 hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <button
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={`Shopping cart with ${count || 0} items`}
    >
      {/* Shopping bag icon */}
      <svg className="w-6 h-6 text-gray-700 hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
      </svg>

      {/* Badge with count */}
      {count !== null && count > 0 && (
        <span className="absolute bottom-0 right-0 bg-gray-700 text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] translate-x-1 -translate-y-0.5">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

// Country/Currency data - Specified countries
const countries = [
  { code: 'UAE', name: 'United Arab Emirates', currency: 'AED', symbol: '', url: 'https://www.vicegolf.com' },
  // { code: 'US', name: 'United States', currency: 'USD', symbol: '$', url: 'https://www.vicegolf.com' },
  // { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'CA$', url: 'https://www.vicegolf.com/en-ca' },
  // { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€', url: 'https://www.vicegolf.de' },
  // { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'Fr.', url: 'https://www.vicegolf.ch' },
  // { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', url: 'https://www.vicegolf.co.uk' },
  // { code: 'SE', name: 'Sweden', currency: 'SEK', symbol: 'kr', url: 'https://www.vicegolf.se' },
] as const;

function AccountToggle({ isLoggedIn }: { isLoggedIn: Promise<boolean> }) {
  return (
    <Suspense fallback={<AccountIcon />}>
      <Await resolve={isLoggedIn}>
        {(loggedIn) => (
          <NavLink
            prefetch="intent"
            to={loggedIn ? "/account" : "/account/login"}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label={loggedIn ? "Account" : "Login"}
            title={loggedIn ? "My Account" : "Sign In"}
          >
            <LuUser className="w-6 h-6 text-gray-700 hover:text-black" />
          </NavLink>
        )}
      </Await>
    </Suspense>
  );
}

function AccountIcon() {
  return (
    <div className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
      <LuUser className="w-6 h-6 text-gray-700 hover:text-black" />
    </div>
  );
}

export function CountryCurrencySelector({ isMobile = false }: { isMobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to US
  const [searchTerm, setSearchTerm] = useState('');

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleCountrySelect = (country: typeof countries[number]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
    // Redirect to the selected country site
    window.location.href = country.url;
  };

  return (
    <div className="relative z-[9999]">
      <button
        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 p-2 rounded-md hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select country and currency"
      >
        <img
          src={flagUrls[selectedCountry.code]}
          alt={selectedCountry.name}
          className="w-5 h-5 object-cover flex-shrink-0"
        />
        <span className="hidden sm:inline">
          {selectedCountry.name} ({selectedCountry.currency}{selectedCountry.symbol})
        </span>
        <span className="sm:hidden">
          {selectedCountry.name} ({selectedCountry.currency} {selectedCountry.symbol})
        </span>
        {/* <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg> */}
      </button>

      {/* Dropdown Menu */}
      {/* {isOpen && (
        <>
          {/* Backdrop */}
      {/* <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} /> */}

      {/* Dropdown Content */}
      {/* <div className={`fixed ${isMobile ? 'bottom-16 left-4 right-4' : 'top-[var(--header-height, 80px)] left-4 w-64'} bg-white border border-gray-200 rounded-md shadow-lg z-[9999] max-h-[50vh] overflow-y-auto px-4`}>
            <div className={`py-2 ${isMobile ? 'flex flex-col-reverse' : ''}`}>
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 ${selectedCountry.code === country.code ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'}`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <img
                    src={flagUrls[country.code]}
                    alt={country.name}
                    className="w-5 h-4 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 text-left ml-1 text-sm">
                    {country.name} ({country.currency} {country.symbol})
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )} */}
    </div>
  );
}