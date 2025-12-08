import { Await, Link, useLoaderData } from 'react-router';
import { Suspense, useId, useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Image, Money } from '@shopify/hydrogen';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import { Aside, useAside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import HeaderMenu from './Header/HeaderMenu';
import { CartMain } from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';
import type { MenuData } from '~/lib/shopify/product-queries';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main className="bg-white pt-[120px] md:pt-[140px]">{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({ cart }: { cart: PageLayoutProps['cart'] }) {
  return (
    <Suspense fallback={<p>Loading cart ...</p>}>
      <Await resolve={cart}>
        {(cartData) => (
          <Aside
            type="cart"
            heading={
              <span className="text-base font-normal">
                {`Your Cart${cartData?.totalQuantity ? ` (${cartData.totalQuantity})` : ''}`}
              </span>
            }
          >
            <CartMain cart={cartData} layout="aside" />
          </Aside>
        )}
      </Await>
    </Suspense>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  const [searchValue, setSearchValue] = useState('');
  const aside = useAside();

  // Trending search terms
  const trendingSearches = [
    'Vice Tracer Balls',
    'Vice Golf VGI02',
    'Vice Golf VGI01',
    'Vice Pro(st) Edition',
    'High Visibility Golf Balls',
    'Vice x TCAF Edition'
  ];

  // Suggested searches for when no term is entered
  const suggestedSearches = [
    'vice',
    'vice pro',
    'vice aero carry bag',
    'vice shine junior',
    'vice pro st'
  ];

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // 4 columns x 2 rows

  const closeSearch = () => {
    setIsSearchOpen(false);
    setCurrentPage(1); // Reset to first page when closing search
    setSearchValue('');
    document.body.style.overflow = '';
    aside.close();
  };

  return (
    <Aside type="search" heading="">
      <div className="search-header-with-close">
        <button
          type="button"
          onClick={closeSearch}
          className="search-close-button-top"
          aria-label="Close search"
        >
          Close
        </button>
      </div>
      <div className="predictive-search">
        <SearchFormPredictive>
          {({ fetchResults, inputRef, goToSearch }) => {
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchValue(e.target.value);
              fetchResults(e);
            };
            
            const clearInput = () => {
              if (inputRef.current) {
                inputRef.current.value = '';
                setSearchValue('');
                inputRef.current.focus();
                fetchResults({ target: inputRef.current } as React.ChangeEvent<HTMLInputElement>);
              }
            };
            
            return (
              <div className="search-form-container">
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={20} />
                  <input
                    name="q"
                    onChange={handleChange}
                    onFocus={fetchResults}
                    placeholder="Search"
                    ref={inputRef}
                    type="search"
                    list={queriesDatalistId}
                    autoComplete="off"
                    autoFocus
                    className="search-input"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={clearInput}
                      className="search-clear-button"
                      aria-label="Clear search"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          }}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({ items, total, term, state, closeSearch }) => {
            const { products, queries } = items;

            if (state === 'loading' && term.current) {
              return <div className="search-loading">Searching...</div>;
            }

            // Show suggestions when no search term
            if (!term.current) {
              return (
                <div className="suggestions-section">
                  <h5 className="suggestions-heading">Suggestions</h5>
                  <ul className="suggestions-list">
                    {suggestedSearches.map((suggestion, index) => (
                      <li key={index} className="suggestion-item">
                        <Link
                          to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(suggestion)}`}
                          className="suggestion-link"
                          onClick={closeSearch}
                        >
                          {suggestion}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // Show search results when there's a search term
            return (
              <div className="search-results-container">
                {/* Left Section - Trending Searches */}
                <div className="search-left-section">
                  <div className="trending-searches">
                    <h5>Trending Searches</h5>
                    <div className="trending-tags">
                      {trendingSearches.map((searchTerm, index) => (
                        <Link
                          key={index}
                          to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(searchTerm)}`}
                          className="trending-tag"
                          onClick={closeSearch}
                        >
                          {searchTerm}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section - Products Grid */}
                <div className="search-middle-section">
                  <div className="search-results-grid">
                    <div className="product-results">
                      <div className="products-grid">
                        {products
                          .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                          .map((product) => {
                            const productUrl = `/products/${product.handle}`;
                            const price = product?.selectedOrFirstAvailableVariant?.price;
                            const image = product?.selectedOrFirstAvailableVariant?.image;

                            return (
                              <Link
                                key={product.id}
                                to={productUrl}
                                className="product-card"
                                onClick={closeSearch}
                              >
                                <div className="product-image-container">
                                  {image ? (
                                    <Image
                                      data={{
                                        url: image.url,
                                        altText: image.altText || product.title,
                                        width: 240,
                                        height: 240,
                                      }}
                                      className="product-image"
                                      loading="eager"
                                      loaderOptions={{
                                        scale: 2,
                                        crop: 'center',
                                      }}
                                    />
                                  ) : (
                                    <div className="product-image-placeholder" />
                                  )}
                                </div>
                                <div className="product-info">
                                  <div className="product-title">{product.title}</div>
                                  <div className="product-price">
                                    {price ? <Money data={price} /> : 'AED 0.00'}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  const { productsForNav } = useLoaderData<{ productsForNav: MenuData }>();
  // Get menu items from the productsForNav data
  const menuItems = productsForNav?.menu?.items[0]?.items || [];
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="">
        <HeaderMenu viewport="mobile" menuItems={menuItems} />
      </Aside>
    )
  );
}
