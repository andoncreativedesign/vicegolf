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
  const { close } = useAside();

  // Trending search terms
  const trendingSearches = [
    'Vice Pro Plus',
    'Vice Pro',
    'Vice Golf Pure 2024',
    'Vice Drive',
    'Vice Tour'
  ];

  return (
    <Aside type="search" heading="">
      <div className="search-container w-full h-full flex flex-col bg-white">
        <div className="search-header w-full flex items-center justify-between gap-4 p-4 border-b border-gray-100">
          <div className="flex-1 relative">
            <SearchFormPredictive>
              {({ fetchResults, inputRef }) => (
                <div className="relative flex items-center w-full">
                  <span className="absolute left-4 text-gray-500 z-10">
                    <Search size={20} />
                  </span>
                  <input
                    name="q"
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    placeholder="Search"
                    ref={inputRef}
                    type="search"
                    list={queriesDatalistId}
                    autoComplete="off"
                    autoFocus
                    className="w-full bg-gray-100 border-0 rounded-full py-3.5 pl-12 pr-4 text-base md:text-lg focus:ring-0 focus:bg-gray-50 transition-colors placeholder:text-gray-500"
                  />
                </div>
              )}
            </SearchFormPredictive>
          </div>
          <button
            onClick={close}
            className="text-gray-900 font-medium hover:text-gray-600 transition-colors px-2 whitespace-nowrap"
          >
            Close
          </button>
        </div>

        <div className="search-body flex-1 overflow-y-auto">
          <SearchResultsPredictive>
            {({ items, total, term, state, closeSearch }) => {
              const { products, queries } = items;
              const isLoading = state === 'loading' && term.current;
              const hasTerm = !!term.current;

              if (isLoading) {
                return (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                );
              }

              return (
                <div className="max-w-[1400px] mx-auto px-6 py-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Suggestions/Trending */}
                    <div className="md:col-span-3">
                      <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">
                        {hasTerm ? 'Suggestions' : 'Trending Searches'}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {(hasTerm ? queries : trendingSearches.map(t => ({ text: t }))).map((item, i) => {
                          const text = typeof item === 'string' ? item : item.text;
                          if (!text) return null;
                          return (
                            <Link
                              key={i}
                              to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(text)}`}
                              onClick={close}
                              className="text-gray-900 hover:text-gray-600 py-1 font-medium transition-colors text-left"
                            >
                              {text}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Products */}
                    <div className="md:col-span-9">
                      {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {products.map((product) => (
                            <Link
                              key={product.id}
                              to={`/products/${product.handle}`}
                              onClick={close}
                              className="group block"
                            >
                              <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden relative">
                                {product.selectedOrFirstAvailableVariant?.image && (
                                  <Image
                                    data={product.selectedOrFirstAvailableVariant.image}
                                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                                    sizes="(min-width: 768px) 25vw, 50vw"
                                  />
                                )}
                              </div>
                              <h4 className="font-bold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                                {product.title}
                              </h4>
                              <p className="text-gray-500 text-sm">
                                {product.productType}
                              </p>
                              <p className="font-medium text-gray-900 mt-1">
                                <Money data={product.selectedOrFirstAvailableVariant?.price!} />
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        hasTerm && (
                          <div className="text-center py-12 text-gray-500">
                            <p>No results found for "{term.current}"</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          </SearchResultsPredictive>
        </div>
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
