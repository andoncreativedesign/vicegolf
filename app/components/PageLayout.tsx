import { Await, Link, useFetcher, useLoaderData, useNavigate, useRouteLoaderData } from 'react-router';
import { Suspense, useId, useState, useEffect, useRef } from 'react';
import type { RootLoader } from '~/root';
import { Search } from 'lucide-react';
import { Image, Money } from '@shopify/hydrogen';
import { AedIcon } from './ui/AedIcon';
import type { CartApiQueryFragment, FooterQuery, HeaderQuery, } from 'storefrontapi.generated';
import { Aside, useAside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import HeaderMenu from './Header/HeaderMenu';
import { CartMain } from '~/components/CartMain';
import { SEARCH_ENDPOINT, SearchFormPredictive, } from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';
// import { ChatbotButton, ChatbotPopup } from './Chatbot/ChatbotButton';
import type { MenuData } from '~/lib/shopify/product-queries';
import type { Collection } from '@shopify/hydrogen/storefront-api-types';
import type { BannerData } from '~/lib/sanity/home';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  banner?: BannerData;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  banner,
}: PageLayoutProps) {
  // const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header header={header} cart={cart} isLoggedIn={isLoggedIn} publicStoreDomain={publicStoreDomain} banner={banner} />
      )}
      <main className={`bg-[#fafafa] ${banner?.enabled ? 'pt-[90px] md:pt-[110px] lg:pt-[180px]' : 'pt-[60px] md:pt-[80px] lg:pt-[140px]'}`}>
        <div className="w-full mx-auto">
          {children}
        </div>
      </main>
      <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} />
      {/* <ChatbotButton isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} /> */}
      {/* <ChatbotPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} /> */}
    </Aside.Provider>
  );
}

function CartAside({ cart }: { cart: PageLayoutProps['cart'] }) {
  return (
    <Suspense fallback={<p>Loading cart ...</p>}>
      <Await resolve={cart}>
        {(cartData) => (
          <Aside type="cart" heading={
            <span className="text-base font-normal">
              {`Your Cart${cartData?.totalQuantity ? ` (${cartData.totalQuantity})` : ''}`}
            </span>
          }>
            <CartMain cart={cartData} />
          </Aside>
        )}
      </Await>
    </Suspense>
  );
}

// SearchAside.tsx
// SearchAside.tsx

function SearchAside() {
  const queriesDatalistId = useId();
  const { close } = useAside();
  const navigate = useNavigate();

  const fetcher = useFetcher<any>({ key: 'search' });
  const [pendingTerm, setPendingTerm] = useState('');
  const [canShowNoResults, setCanShowNoResults] = useState(false);

  const trendingSearches: Pick<
    Collection,
    'handle' | 'id' | 'title' | 'trackingParameters'
  >[] = [
      { id: 'gid://shopify/Collection/1', handle: 'golf-balls', title: 'Golf Balls', trackingParameters: null },
      { id: 'gid://shopify/Collection/2', handle: 'golf-clubs', title: 'Golf Clubs', trackingParameters: null },
      { id: 'gid://shopify/Collection/5', handle: 'bundle-offers', title: 'Bundle offers', trackingParameters: null },
    ];

  const handleCollectionNavigate = (
    e: React.UIEvent<HTMLButtonElement, UIEvent>,
    item: Pick<Collection, 'handle' | 'id' | 'title' | 'trackingParameters'>,
  ) => {
    e.preventDefault();
    if (!item?.handle) { navigate(-1); return; }
    try { navigate(`/collections/${item.handle}`); }
    catch { navigate(-1); }
    close();
  };

  const handleClose = () => {
    close();
    setPendingTerm('');
  };

  return (
    <Aside type="search" heading="">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="search-header w-full border-b border-gray-100 bg-white">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="flex md:grid md:grid-cols-12 gap-4 md:gap-8 items-center">

            <div className="md:col-span-3 hidden md:block" />

            <div className="flex-1 md:col-span-8 relative md:w-[90%]" style={{ padding: 0, margin: 0 }}>
              <div className="rounded-full w-full" style={{ padding: 0, margin: 0 }}>
                <SearchFormPredictive
                  className="block w-full m-0 p-0"
                  style={{ width: '100%', margin: 0, padding: 0, display: 'block' }}
                  fetcher={fetcher}
                  onTermChange={setPendingTerm}
                  onNoResultsChange={setCanShowNoResults}
                >
                  {({ fetchResults, inputRef }) => (
                    <div className="relative flex items-center m-0 p-0" style={{ width: '100%', margin: 0, padding: 0 }}>
                      <span className="absolute left-4 text-gray-500 z-10">
                        <Search size={20} />
                      </span>
                      <input
                        name="q"
                        onChange={fetchResults}
                        onFocus={(e) => {
                          if (e.target.value) setPendingTerm(e.target.value);
                        }}
                        placeholder="Search"
                        ref={inputRef}
                        type="search"
                        list={queriesDatalistId}
                        autoComplete="off"
                        autoFocus
                        style={{
                          borderRadius: '9999px',
                          margin: 0,
                          padding: '12px 16px 12px 48px',
                          width: '100%',
                          maxWidth: 'none',
                          flex: '1 1 auto',
                          border: 'none',
                          outline: 'none',
                        }}
                        className="appearance-none bg-gray-200 border-0 text-base md:text-lg focus:ring-0 focus:outline-none transition-colors placeholder:text-gray-500 rounded-full m-0"
                      />
                    </div>
                  )}
                </SearchFormPredictive>
              </div>
            </div>

            <div className="md:col-span-1 flex justify-end flex-shrink-0">
              <button
                onClick={handleClose}
                className="text-gray-900 font-medium hover:text-gray-600 transition-colors px-2 whitespace-nowrap cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results body ───────────────────────────────────────────────────── */}
      <div className="search-body flex-1 overflow-y-auto w-full bg-white">
        <SearchResultsPredictive fetcher={fetcher} pendingTerm={pendingTerm}>
          {({ items, total, term, state, closeSearch }) => {
            const { products, collections } = items;

            const hasTerm = !!pendingTerm && pendingTerm.trim().length > 0;
            const isLoading = (state === 'loading' || state === 'submitting') && hasTerm && products.length === 0;

            return (
              <div className="max-w-[1500px] mx-auto px-4 py-8">

                {/* Inline spinner — never blocks the product grid */}
                {isLoading && (
                  <div className="flex justify-center pb-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                  {/* ── Left: collection suggestions ───────────────────────── */}
                  <div className="md:col-span-3">
                    {hasTerm && collections.length > 0 && (
                      <>
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">
                          Suggestions
                        </h3>
                        <div className="flex flex-col gap-2">
                          {collections.map((item: any, i: number) => (
                            <button
                              key={item.id ?? i}
                              onClick={(e) => handleCollectionNavigate(e, item)}
                              className="text-gray-900 hover:text-gray-600 cursor-pointer py-1 font-medium transition-colors text-left"
                            >
                              {item.title}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* ── Center: products or trending ───────────────────────── */}
                  <div className="md:col-span-8 w-full md:w-[90%]">
                    {hasTerm ? (
                      products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {products.map((product: any) => (
                            <Link
                              key={product.id}
                              to={`/products/${product.handle}`}
                              onClick={() => { closeSearch(); setPendingTerm(''); }}
                              className="group block no-underline"
                            >
                              <div className="aspect-square bg-white rounded-xl mb-3 overflow-hidden">
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
                                  {parseFloat(
                                    product.selectedOrFirstAvailableVariant?.price?.amount || '0',
                                  ).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </p>
                            </Link>
                          ))}
                        </div>
                      ) : !isLoading && canShowNoResults ? (
                        <div className="text-center py-12 text-gray-500">
                          <p>No results found for &ldquo;{term || pendingTerm}&rdquo;</p>
                        </div>
                      ) : null
                    ) : (
                      <>
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">
                          Trending Searches
                        </h3>
                        <div className="flex flex-col gap-2">
                          {trendingSearches.map((item) => (
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

                  <div className="md:col-span-1" />
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
  const rootData = useRouteLoaderData<RootLoader>('root');
  const productsForNav = rootData?.productsForNav;
  // Get menu items from the productsForNav data
  const menuItems = productsForNav?.menu?.items[0]?.items || [];

  return (
    header?.menu &&
    header?.shop?.primaryDomain?.url && (
      <Aside type="mobile" heading="">
        <HeaderMenu viewport="mobile" menuItems={menuItems} />
      </Aside>
    )
  );
}