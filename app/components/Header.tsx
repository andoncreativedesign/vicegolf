import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue, Link} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

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

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const [isApparelHovered, setIsApparelHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink 
              prefetch="intent" 
              to="/" 
              className="text-xl font-bold text-gray-900 hover:text-gray-600"
              end
            >
              {shop.name}
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <div 
              className="relative"
              onMouseEnter={() => setIsApparelHovered(true)}
              onMouseLeave={() => setIsApparelHovered(false)}
            >
              <button 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Apparel
                <svg 
                  className={`ml-1 h-4 w-4 inline-block transition-transform ${isApparelHovered ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isApparelHovered && (
                <div className="fixed left-0 right-0 w-full bg-white shadow-lg z-50" onMouseLeave={() => setIsApparelHovered(false)}>
                  <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-6 gap-8">
                      {apparelDropdown.slice(0, 6).map((section, index) => (
                        <div key={index}>
                          <h3 className="text-sm font-medium text-gray-900 mb-4">
                            {section.title}
                          </h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="group">
                                <Link 
                                  to={item.href}
                                  className="flex flex-col h-full p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                                >
                                  <div className="aspect-square w-full mb-2 bg-gray-100 rounded-md overflow-hidden">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        // Fallback in case image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
                                      }}
                                    />
                                  </div>
                                  <div className="mt-2">
                                    <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">Shop All Apparel</h3>
                          <p className="mt-1 text-sm text-gray-500">Browse our full collection of golf apparel</p>
                        </div>
                        <div className="ml-6">
                          <Link to="/collections/apparel" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            View all<span aria-hidden="true"> &rarr;</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <NavLink
              to="/collections/golf-clubs"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Golf Clubs
            </NavLink>
            <NavLink
              to="/collections/accessories"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Accessories
            </NavLink>
            <NavLink
              to="/collections/sale"
              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Sale
            </NavLink>
          </div>

          {/* Right side icons */}
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Apparel</h3>
              <div className="grid grid-cols-2 gap-2">
                {apparelDropdown.map((section, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="group">
                          <Link 
                            to={item.href}
                            className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg"
                          >
                            <div className="w-16 h-16 shrink-0 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <NavLink
              to="/collections/golf-clubs"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Golf Clubs
            </NavLink>
            <NavLink
              to="/collections/accessories"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Accessories
            </NavLink>
            <NavLink
              to="/collections/sale"
              className="block px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
            >
              Sale
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

// HeaderMenu component is no longer used as we've moved the navigation directly into the Header component
// This is kept for backward compatibility
export function HeaderMenu() {
  return null;
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center space-x-4" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink 
        prefetch="intent" 
        to="/account" 
        className={({isActive}) => 
          `px-1 pt-1 border-b-2 text-sm font-medium ${
            isActive 
              ? 'border-indigo-500 text-gray-900' 
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`
        }
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
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
    >
      Cart {count === null ? <span>&nbsp;</span> : count}
    </a>
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

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

// Active link styling is now handled directly in the className prop of NavLink components
