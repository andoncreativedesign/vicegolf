import { Analytics, getShopAnalytics, useNonce } from '@shopify/hydrogen';
import { Outlet, useRouteError, isRouteErrorResponse, type ShouldRevalidateFunction, Links, Meta, Scripts, ScrollRestoration, useRouteLoaderData, } from 'react-router';
import type { Route } from './+types/root';
import favicon from '~/assets/vicefav.svg';
import { FOOTER_QUERY, HEADER_QUERY } from '~/lib/fragments';
import { createCategoryQuery, MULTIPLE_COLLECTIONS_QUERY_FOR_NAV, type MenuData } from '~/lib/shopify/product-queries';
import { getHomePageData } from '~/lib/sanity/home';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import { PageLayout } from './components/PageLayout';
import { CustomToastContainer } from './components/basic/CustomToast';
import toastStyles from 'react-toastify/dist/ReactToastify.css?url';
import { CookieConsentWrapper } from './components/cookie/CookieConsentWrapper';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to return defaultShouldRevalidate instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
    { rel: 'preconnect', href: 'https://shop.app' },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
    { rel: "stylesheet", href: toastStyles }
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const { storefront, env } = args.context;

  // Resolve critical deferred data so it's available immediately for pricing logic
  const [customer, plusDiscountPercentage] = await Promise.all([
    deferredData.customer,
    deferredData.plusDiscountPercentage
  ]);

  console.log('Loader returning Plus Discount:', plusDiscountPercentage);

  return {
    ...deferredData,
    customer,
    plusDiscountPercentage,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false, // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context }: Route.LoaderArgs) {
  const { storefront } = context;

  const golfBallsHandle = createCategoryQuery('Golf Balls');
  const golfClubsHandle = createCategoryQuery('Golf Club Set');
  const apparelHandle = createCategoryQuery('Gloves Men');
  const gearHandle = createCategoryQuery('Polo');
  const limitedEditionsHandle = createCategoryQuery('Towels');
  const fittingCustomisationHandle = createCategoryQuery('Longsleeve');
  const juniorsHandle = createCategoryQuery('Divot Tool');

  const [header, productsForNav, homePageData] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { headerMenuHandle: 'main-menu' }, // Adjust to your header menu handle
    }),
    storefront.query<MenuData>(MULTIPLE_COLLECTIONS_QUERY_FOR_NAV, {
      cache: storefront.CacheLong(),
      variables: {
        handle: "customer-account-main-menu",
        country: "IN",
        language: "EN",
      }
    }),
    // Fetch home page data including banner
    getHomePageData().then(data => {
      return data;
    }).catch(error => {
      console.error('Error fetching home page data:', error);
      return null;
    }),
  ]);

  const bannerData = homePageData?.banner;

  return { header, productsForNav, banner: bannerData };
}

import { CUSTOMER_DETAILS_QUERY } from '~/graphql/customer-account/CustomerDetailsQuery';

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  const { storefront, customerAccount, cart } = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { footerMenuHandle: 'footer' }, // Adjust to your footer menu handle
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  const customer = customerAccount.isLoggedIn().then(async (isLoggedIn) => {
    if (isLoggedIn) {
      try {
        const { data } = await customerAccount.query(CUSTOMER_DETAILS_QUERY);
        return data?.customer;
      } catch (error) {
        console.error('Error fetching customer details in root:', error);
        return null;
      }
    }
    return null;
  });

  const plusDiscountPercentage = (async () => {
    const { env } = context;
    if (!env.ADMIN_API_URL || !env.ADMIN_ACCESS_TOKEN) {
      console.warn('Admin API credentials missing, using fallback discount');
      return 0.05;
    }

    try {
      const adminApiUrl = `${env.ADMIN_API_URL}/graphql.json`;
      const query = `#graphql
        query getPlusDiscount {
          automaticDiscountNodes(first: 50, query: "status:active") {
            nodes {
              automaticDiscount {
                ... on DiscountAutomaticBasic {
                  title
                  customerGets {
                    value {
                      ... on DiscountPercentage {
                        percentage
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch(adminApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': env.ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        console.error('Admin API fetch failed:', response.status);
        return 0.05;
      }

      const json = await response.json() as any;
      const nodes = json.data?.automaticDiscountNodes?.nodes || [];

      nodes.forEach((n: any) => {
        const title = n.automaticDiscount?.title;
        const percentage = n.automaticDiscount?.customerGets?.value?.percentage;
        console.log(`Active Discount: "${title}" - Percentage: ${percentage}`);
      });

      // Find the discount that matches "Automatic Discount" or "Plus" or "Member"
      const plusNode = nodes.find((node: any) => {
        const title = (node.automaticDiscount?.title || '').toLowerCase().trim();
        return title === 'automatic discount' || title.includes('plus') || title.includes('member');
      });

      let percentage = plusNode?.automaticDiscount?.customerGets?.value?.percentage;

      if (typeof percentage !== 'number') {
        // Fallback: search for any discount that is for Plus Members if title match failed
        // (Just in case the title is something else, we take the first one that mentions plus/member in the query results)
        // Actually, let's keep it strict but maybe it's a Code Discount?
      }

      if (typeof percentage === 'number') {
        console.log(`Found Plus Discount: ${percentage * 100}%`);
        return percentage;
      }

      console.log('No matching automatic discount found, using default 5%');
      return 0.05;
    } catch (e) {
      console.error('Error fetching plus discount percentage:', e);
      return 0.05;
    }
  })();

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    customer,
    plusDiscountPercentage,
    footer,
  };
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<typeof loader>('root');
  const { header, footer } = data || {};

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body className='font-sans'>
        <CookieConsentWrapper>
          {children}
        </CookieConsentWrapper>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      <PageLayout {...data} banner={data.banner}>
        <Outlet />
        <CustomToastContainer />
      </PageLayout>
    </Analytics.Provider>
  );
}

export { ErrorBoundary } from './components/ErrorBoundary';