import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {debugMenuItems} from '~/utils/debug-menu';

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

const apparelDropdown: DropdownSection[] = [
  {
    title: 'Polos',
    items: [
      {
        name: 'Performance Polos',
        href: '/apparel/polos',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
        description: 'Moisture-wicking golf polos'
      }
    ]
  },
  {
    title: 'Sweatshirts & Hoodies',
    items: [
      {
        name: 'Golf Hoodies',
        href: '/apparel/hoodies',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop&hue=200',
        description: 'Comfortable golf sweatshirts'
      }
    ]
  },
  {
    title: 'Mid & Outer Layers',
    items: [
      {
        name: 'Golf Jackets',
        href: '/apparel/jackets',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop&hue=120',
        description: 'Weather-resistant outerwear'
      }
    ]
  },
  {
    title: 'T-Shirts',
    items: [
      {
        name: 'Golf T-Shirts',
        href: '/apparel/tshirts',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop&brightness=110',
        description: 'Casual golf tees'
      }
    ]
  },
  {
    title: 'Headwear',
    items: [
      {
        name: 'Golf Hats',
        href: '/apparel/hats',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop&contrast=120',
        description: 'Caps and visors'
      }
    ]
  },
  {
    title: 'Shoes',
    items: [
      {
        name: 'Golf Shoes',
        href: '/apparel/shoes',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop&sepia=20',
        description: 'Performance golf footwear'
      }
    ]
  }
];

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

// Inline SVG flags for SSR compatibility
const flagSvgs: Record<string, string> = {
  US: `<svg width="20" height="15" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 7410 3900">
  <path d="M0,0h7410v3900H0" fill="#b31942"/>
  <path d="M0,450H7410m0,600H0m0,600H7410m0,600H0m0,600H7410m0,600H0" stroke="#FFF" stroke-width="300"/>
  <path d="M0,0h2964v2100H0" fill="#0a3161"/>
  <g fill="#FFF">
    <g id="s18">
      <g id="s9">
        <g id="s5">
          <g id="s4">
            <path id="s" d="M247,90 317.534230,307.082039 132.873218,172.917961H361.126782L176.465770,307.082039z"/>
            <use xlink:href="#s" y="420"/>
            <use xlink:href="#s" y="840"/>
            <use xlink:href="#s" y="1260"/>
          </g>
          <use xlink:href="#s4" x="247" y="210"/>
        </g>
        <use xlink:href="#s9" x="494"/>
      </g>
      <use xlink:href="#s18" x="988"/>
      <use xlink:href="#s9" x="1976"/>
      <use xlink:href="#s5" x="2470"/>
    </g>
  </g>
</svg>`,
  CA: `<svg width="20" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9600 4800">
	<path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h4602l-99 99H0z"/>
	<path fill="#fff" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"/>
</svg>`,
  DE: `<svg width="20" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 18">
	<rect width="30" height="18" y="0" x="0" fill="#000"/>
	<rect width="30" height="12" y="6" x="0" fill="#D00"/>
	<rect width="30" height="3" y="12" x="0" fill="#FFCE00"/>
</svg>`,
  CH: `<svg width="20" height="15" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path d="m0 0h32v32h-32z" fill="#f00"/>
  <path d="m13 6h6v7h7v6h-7v7h-6v-7h-7v-6h7z" fill="#fff"/>
</svg>`,
  GB: `<svg width="20" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 18">
<clipPath id="s">
	<path d="M0,0 v18 h30 v-18 z"/>
</clipPath>
<clipPath id="t">
	<path d="M15,9 h15 v9 z v9 h-15 z h-15 v-9 z v-9 h15 z"/>
</clipPath>
<g clip-path="url(#s)">
	<path d="M0,0 v18 h30 v-18 z" fill="#012169"/>
	<path d="M0,0 L30,18 M30,0 L0,18" stroke="#fff" stroke-width="4"/>
	<path d="M0,0 L30,18 M30,0 L0,18" clip-path="url(#t)" stroke="#C8102E" stroke-width="2.6666666666666665"/>
	<path d="M15,0 v18 M0,9 h30" stroke="#fff" stroke-width="6.666666666666667"/>
	<path d="M15,0 v18 M0,9 h30" stroke="#C8102E" stroke-width="4"/>
</g>
</svg>`,
  SE: `<svg width="20" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 20">
  <rect width="32" height="20" fill="#00267a"/>
  <rect x="8" width="4" height="20" fill="#fedc11"/>
  <rect y="6" width="32" height="4" fill="#fedc11"/>
</svg>`,
};

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  // Debug: Log menu items to console (remove in production)
  useEffect(() => {
    debugMenuItems(menu, 'Header Menu');
  }, [menu]);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Left: Country/Currency Selector */}
        <div className="flex items-center space-x-2">
          <CountryCurrencySelector />
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <NavLink prefetch="intent" to="/" className="flex items-center">
            <img 
              src="/vice_logo.svg" 
              alt="Vice Logo" 
              className="h-8 w-auto"
            />
          </NavLink>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-2">
          <SearchToggle />
          <NavLink 
            prefetch="intent" 
            to="/account" 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Account"
          >
            <svg className="w-6 h-6 text-gray-700 hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </NavLink>
          <CartToggle cart={cart} />
          <HeaderMenuMobileToggle />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain?.url || ''}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </nav>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  // Get Shopify menu items
  const shopifyMenuItems = menu?.items || [];
  
  // Convert Shopify URLs to relative URLs
  const convertToRelativeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return url; // Return as-is if not a valid URL
    }
  };
  
  // Additional golf-specific navigation items to complement Shopify menu
  const additionalGolfItems = [
    { title: 'GOLF BALLS', url: '/collections/golf-balls' },
    { title: 'GOLF CLUBS', url: '/collections/golf-clubs' },
    { title: 'APPAREL', url: '/collections/apparel' },
    { title: 'GEAR', url: '/collections/gear' },
    { title: 'LIMITED EDITIONS', url: '/collections/limited-editions' },
    { title: 'FITTING & CUSTOMISATION', url: '/collections/custom' },
    { title: 'JUNIORS', url: '/collections/juniors' },
  ];

  // Combine Shopify menu items with additional golf items
  const shopifyItems = shopifyMenuItems.map(item => ({
    title: item.title.toUpperCase(),
    url: convertToRelativeUrl(item.url),
    id: item.id,
    items: item.items?.map(subItem => ({
      title: subItem.title,
      url: convertToRelativeUrl(subItem.url),
      id: subItem.id,
    })) || []
  }));

  // Create final navigation combining Shopify items and additional golf items
  const navigationItems = [
    ...shopifyItems,
    ...additionalGolfItems
  ];

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col space-y-4 p-4" role="navigation">
        {navigationItems.map((item, index) => (
          <div key={item.id || index}>
            <NavLink
              onClick={close}
              prefetch="intent"
              to={item.url}
              className="text-lg font-medium text-gray-900 hover:text-gray-600 block"
            >
              {item.title}
            </NavLink>
            {/* Render sub-menu items for mobile */}
            {item.items && item.items.length > 0 && (
              <div className="ml-4 mt-2 space-y-2">
                {item.items.map((subItem, subIndex) => (
                  <NavLink
                    key={subItem.id || subIndex}
                    onClick={close}
                    prefetch="intent"
                    to={subItem.url}
                    className="text-base font-normal text-gray-700 hover:text-gray-900 block"
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex items-center justify-center space-x-8 py-4" role="navigation">
      {navigationItems.map((item, index) => (
        <div key={item.id || index} className="relative group">
          <NavLink
            prefetch="intent"
            to={item.url}
            className={({isActive}) => 
              `text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive 
                  ? 'text-black border-b-2 border-black pb-1' 
                  : 'text-gray-700 hover:text-black'
              }`
            }
          >
            {item.title}
          </NavLink>
          
          {/* Dropdown menu for desktop */}
          {item.items && item.items.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
              <div className="py-2">
                {item.items.map((subItem, subIndex) => (
                  <NavLink
                    key={subItem.id || subIndex}
                    prefetch="intent"
                    to={subItem.url}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black"
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}



function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
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
  const {open} = useAside();
  return (
    <button 
      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" 
      onClick={() => open('search')}
      aria-label="Search"
    >
      <svg className="w-6 h-6 text-gray-700 hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
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
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
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
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'CA$' },
  { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'Fr.' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', symbol: 'kr' },
];

function CountryCurrencySelector() {
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

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
    // Here you would typically update the store's locale/currency
    console.log('Selected country:', country);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 p-2 rounded-md hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select country and currency"
      >
        <div 
          className="w-5 h-4 flex items-center justify-center flex-shrink-0"
          dangerouslySetInnerHTML={{ __html: flagSvgs[selectedCountry.code] }} 
        />
        <span className="hidden sm:inline">
          {selectedCountry.name} ({selectedCountry.currency} {selectedCountry.symbol})
        </span>
        <span className="sm:hidden">
          {selectedCountry.currency} {selectedCountry.symbol}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-80 overflow-y-auto">
            {/* Search Input */}
            <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search countries or currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="py-2">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200 ${
                    selectedCountry.code === country.code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  }`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <div 
                    className="w-5 h-4 flex items-center justify-center flex-shrink-0"
                    dangerouslySetInnerHTML={{ __html: flagSvgs[country.code] }} 
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs text-gray-500">
                      {country.currency} {country.symbol}
                    </div>
                  </div>
                  {selectedCountry.code === country.code && (
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}