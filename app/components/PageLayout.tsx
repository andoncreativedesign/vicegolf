import { Await, Link, useFetcher, useLoaderData, useNavigate } from 'react-router';
import { Suspense, useId, useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Image, Money } from '@shopify/hydrogen';
import { AedIcon } from './ui/AedIcon';
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
import type { Collection } from '@shopify/hydrogen/storefront-api-types';

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
      <main className="bg-[#fafafa] pt-[120px] md:pt-[140px]">
        <div className="w-full max-w-[2560px] mx-auto">
          <div className="w-full max-w-[1920px] mx-auto ">
            {children}
          </div>
        </div>
      </main>
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
  const fetcher = useFetcher()
  const navigate = useNavigate()

  // Trending search terms
  // const trendingSearches = [
  //   'Vice Pro Plus',
  //   'Vice Pro',
  //   'Vice Golf Pure 2024',
  //   'Vice Drive',
  //   'Vice Tour'
  // ];

  const trendingSearches: Pick<Collection, "handle" | "id" | "title" | "trackingParameters">[] = [
    {
      id: 'gid://shopify/Collection/1',
      handle: 'golf-balls',
      title: 'Vice Pro Plus',
      trackingParameters: null
    },
    {
      id: 'gid://shopify/Collection/2',
      handle: 'golf-balls',
      title: 'Vice Pro',
      trackingParameters: null
    },
    {
      id: 'gid://shopify/Collection/3',
      handle: 'golf-balls',
      title: 'Vice Golf Pure 2024',
      trackingParameters: null
    },
    {
      id: 'gid://shopify/Collection/4',
      handle: 'golf-balls',
      title: 'Vice Drive',
      trackingParameters: null
    },
    {
      id: 'gid://shopify/Collection/5',
      handle: 'golf-balls',
      title: 'Vice Tour',
      trackingParameters: null
    }
  ];

  const handleCollectionNavigate = (
    e: React.UIEvent<HTMLButtonElement, UIEvent>,
    item: Pick<Collection, "handle" | "id" | "title" | "trackingParameters">
  ) => {
    e.preventDefault()
    if (!item?.handle) navigate(-1)
    try {
      fetcher.submit(
        { handle: item.handle },
        { method: "post", action: "/api/collection" }
      );
    } catch (error) {
      navigate(-1)
    }
  }

  useEffect(() => {
    if (
      fetcher.state === "idle"
      && fetcher.data?.collection?.id
      && fetcher.data?.collection?.title
    ) {
      const { id, title } = fetcher.data.collection
      close()
      navigate(`/collections/${encodeURIComponent(JSON.stringify([id]))}/${encodeURIComponent(title)}`);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  return (
    <Aside type="search" heading="">
      <div className="search-header w-full border-b border-gray-100 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          {/* Mobile: Flex layout, Desktop: Grid layout */}
          <div className="flex md:grid md:grid-cols-12 gap-4 md:gap-8 items-center">
            {/* Section A: Desktop spacer */}
            <div className="md:col-span-3 hidden md:block text-white">
              {/* Empty spacer */}
            </div>

            {/* Section B: Search Input */}
            <div className="flex-1 md:col-span-8 relative md:w-[90%]" style={{ padding: 0, margin: 0 }}>
              <div className="rounded-full w-full" style={{ padding: 0, margin: 0 }}>
                <SearchFormPredictive className="block w-full m-0 p-0" style={{ width: '100%', margin: 0, padding: 0, display: 'block' }}>
                  {({ fetchResults, inputRef }) => (
                    <div className="relative flex items-center m-0 p-0" style={{ width: '100%', margin: 0, padding: 0 }}>
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
                        style={{ borderRadius: '9999px', margin: 0, padding: '12px 16px 12px 48px', width: '100%', maxWidth: 'none', flex: '1 1 auto', border: 'none', outline: 'none' }}
                        className="appearance-none bg-gray-200 border-0 text-base md:text-lg focus:ring-0 focus:outline-none transition-colors placeholder:text-gray-500 rounded-full m-0"
                      />
                    </div>
                  )}
                </SearchFormPredictive>
              </div>
            </div>

            {/* Section C: Close Button */}
            <div className="md:col-span-1 flex justify-end flex-shrink-0">
              <button
                onClick={close}
                className="text-gray-900 font-medium hover:text-gray-600 transition-colors px-2 whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="search-body flex-1 overflow-y-auto w-full bg-white">
        <SearchResultsPredictive>
          {({ items, total, term, state, closeSearch }) => {
            const { products, queries, collections } = items;
            const isLoading = state === 'loading' && term.current;
            const hasTerm = !!term.current;

            console.log('search collections - ', collections)

            if (isLoading) {
              return (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              );
            }

            return (
              <div className="max-w-[1500px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Only show Suggestions when user is typing */}
                  <div className="md:col-span-3">
                    {hasTerm && (
                      <>
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">
                          Suggestions
                        </h3>
                        <div className="flex flex-col gap-2">
                          {/* ! quires map  */}
                          {/* {queries.map((item, i) => {
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
                          })} */}

                          {collections.map((item, i) => {
                            return (
                              // <Link
                              //   key={i}
                              //   to={`collections/${encodeURIComponent(item.handle)}`}
                              //   onClick={close}
                              //   className="text-gray-900 hover:text-gray-600 py-1 font-medium transition-colors text-left"
                              // >
                              //   {item.title}
                              // </Link>
                              <button
                                key={i}
                                onClick={(e) => handleCollectionNavigate(e, item)}
                                className="text-gray-900 hover:text-gray-600 cursor-pointer py-1 font-medium transition-colors text-left"
                              >
                                {item.title}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Center Column: Products when searching, Trending when not */}
                  <div className="md:col-span-8 w-full md:w-[90%]">
                    {hasTerm ? (
                      // Show products when user is searching
                      products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {products.map((product) => (
                            <Link
                              key={product.id}
                              to={`/products/${product.handle}`}
                              onClick={close}
                              className="group block no-underline"
                            >
                              <div className="aspect-square bg-white rounded-xl mb-3 overflow-hidden relative">
                                {product.selectedOrFirstAvailableVariant?.image && (
                                  <Image
                                    data={product.selectedOrFirstAvailableVariant.image}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    sizes="(min-width: 768px) 20vw, 50vw"
                                  />
                                )}
                              </div>
                              <h4 className="font-bold text-black text-base mb-0.5 line-clamp-2 no-underline">
                                {product.title}
                              </h4>
                              <p className="text-gray-500 text-sm mb-1">
                                {product.productType}
                              </p>
                              <p className="font-normal text-black text-sm flex items-center gap-1">
                                <AedIcon />
                                <span>
                                  {parseFloat(product.selectedOrFirstAvailableVariant?.price?.amount || '0').toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}
                                </span>
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <p>No results found for "{term.current}"</p>
                        </div>
                      )
                    ) : (
                      // Show Trending Searches when no search term
                      <>
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">
                          Trending Searches
                        </h3>
                        <div className="flex flex-col gap-2">
                          {trendingSearches.map((item) => (
                            // <Link
                            //   key={i}
                            //   to={`${SEARCH_ENDPOINT}?q=${encodeURIComponent(text)}`}
                            //   onClick={close}
                            //   className="text-gray-900 hover:text-gray-600 py-1 font-medium transition-colors text-left"
                            // >
                            //   {text}
                            // </Link>
                            <button
                              key={item.id}
                              onClick={(e) => handleCollectionNavigate(e, item)}
                              className="text-gray-900 cursor-pointer hover:text-gray-600 py-1 font-medium transition-colors text-left"
                            >
                              {item.title}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Section C: Empty Spacer */}
                  <div className="md:col-span-1 text-white">
                    {/* Empty spacer */}
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
