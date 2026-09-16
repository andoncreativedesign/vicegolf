import { Suspense, useEffect, useState, useRef } from 'react';
import { LuUser } from 'react-icons/lu';
import { Await, NavLink, useAsyncValue, useLoaderData, useRouteLoaderData, useNavigate, type LoaderFunctionArgs } from 'react-router';
import { type CartViewPayload, Image, useAnalytics, useOptimisticCart, } from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { debugMenuItems } from '~/utils/debug-menu';
import type { RootLoader } from '~/root';
import Banner from './Banner';
import type { MenuData } from '~/lib/shopify/product-queries';
import type { BannerData } from '~/lib/sanity/home';
import DropdownItem from './Header/NavDropdownItem';
import HeaderMenu from './Header/HeaderMenu';
import { COUNTRIES, COUNTRIES_LIST, buildLocalizedUrl, type SupportedCountry } from '~/lib/i18n';
import { AE, SA, OM } from 'country-flag-icons/react/3x2';

function CountryFlag({ country, className = 'w-4 h-3 md:w-5 md:h-3.5 object-cover rounded-xs' }: { country: string; className?: string }) {
  if (country === 'SA') return <SA className={className} />;
  if (country === 'OM') return <OM className={className} />;
  return <AE className={className} />;
}

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

  const rootData = useRouteLoaderData<RootLoader>('root');
  const activePathPrefix = rootData?.selectedLocale?.pathPrefix || '/en-ae';
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleMenuNavigation = async () => {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const homePath = activePathPrefix.replace(/\/$/, '');
    if (currentPath === homePath) return; // Already on home page, do nothing

    try {
      setIsNavigating(true);
      await navigate(activePathPrefix);
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
      <div className={`flex items-center justify-between px-2 w-full transition-all duration-300 ${isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden pointer-events-none' : 'py-3 h-auto opacity-100 overflow-visible'}`}>
        {/* Left: Mobile Menu Toggle */}
        <div className="flex-1 flex items-center">
          <HeaderMenuMobileToggle />
          <div className="hidden lg:block ml-4 relative z-50">
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rootData = useRouteLoaderData<RootLoader>('root');

  // Active country from root context (defaults to AE)
  const activeCountryCode: SupportedCountry =
    (rootData?.selectedLocale?.country as SupportedCountry) || 'AE';

  const selectedCountry = COUNTRIES[activeCountryCode] || COUNTRIES.AE;

  // Close dropdown when pressing outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const handleCountrySelect = (countryCode: SupportedCountry) => {
    setIsOpen(false);
    if (countryCode === activeCountryCode) return;

    // Set cookie persistence for 1 year
    document.cookie = `vice_country=${countryCode}; path=/; max-age=31536000; SameSite=Lax`;

    // Compute localized destination URL
    const targetPath = buildLocalizedUrl(window.location.pathname, countryCode);
    const targetUrl = `${targetPath}${window.location.search}`;

    // Navigate to localized route
    window.location.href = targetUrl;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200 py-1 px-2.5 rounded-full border border-gray-200 hover:border-gray-400 bg-white/95 backdrop-blur-xs cursor-pointer shadow-2xs"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select country and currency"
        aria-expanded={isOpen}
      >
        <CountryFlag country={selectedCountry.code} className="w-4 h-3 md:w-5 md:h-3.5 object-cover rounded-xs" />
        <span className="font-semibold text-gray-900">{selectedCountry.currency}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            isMobile ? 'bottom-full mb-2 left-0' : 'top-full mt-2 left-0'
          } w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-[99999] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
              Select Region & Currency
            </span>
            <span className="text-[10px] text-gray-400 font-medium">GCC</span>
          </div>

          <div className="py-1">
            {COUNTRIES_LIST.map((country) => {
              const isSelected = country.code === activeCountryCode;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-gray-100/80 font-semibold text-black'
                      : 'hover:bg-gray-50 text-gray-700 hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CountryFlag country={country.code} className="w-5 h-3.5 rounded-xs shadow-xs" />
                    <div>
                      <div className="leading-tight text-xs font-medium text-gray-900">{country.name}</div>
                      <div className="text-[11px] text-gray-500">{country.currency} ({country.symbol})</div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex h-2 w-2 rounded-full bg-black ring-4 ring-black/10" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}