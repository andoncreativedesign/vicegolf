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
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import { GET_AUTOMATIC_DISCOUNT_QUERY } from '~/graphql/admin/DiscountQuery';

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

  // Resolve critical deferred data
  const [customer, automaticDiscounts] = await Promise.all([
    deferredData.customer,
    deferredData.automaticDiscounts,
  ]);

  // console.log('DEBUG: Customer data resolved:', !!customer);
  // console.log('DEBUG: Automatic discounts resolved:', automaticDiscounts?.length);

  // Dynamically calculate the best membership discount based on customer segments
  const customerTags = (customer?.tags || []).map((t: string) => t.toLowerCase().replace(/\s+/g, '_'));
  // Find any tag starting with 'vice_' which represents the user's tier
  const userSegment = customerTags.find((s: string) => s.startsWith('vice_'));

  // Normalize names to match tags and titles reliably (e.g. 'Vice Staff' -> 'vice_staff')
  const normalizeTierName = (name: string) => {
    let normalized = name.toLowerCase().replace(/\s+/g, '_');
    // Maintain backwards compatibility for legend vs legends mismatch
    if (normalized === 'vice_legends') return 'vice_legend';
    return normalized;
  };

  const normalizedUserSegment = userSegment ? normalizeTierName(userSegment) : null;

  // Filter automatic discounts to strictly follow tier rules based on naming convention
  // 1. If a discount starts with 'Vice ', assume it is a tier discount.
  // 2. All other automatic discounts (global ones) are shown to everyone.
  const eligibleDiscounts = (automaticDiscounts || []).filter((d: any) => {
    const isTierDiscount = d.title && d.title.toLowerCase().startsWith('vice');

    if (!isTierDiscount) return true; // Global discount

    // It's a tier discount, check if it matches the current user's normalized tier
    return normalizeTierName(d.title) === normalizedUserSegment;
  });

  let membershipDiscount = { percentage: 0, amount: null, currencyCode: null, title: '', appliesToAll: false, eligibleProducts: [], eligibleCollections: [] };

  if (normalizedUserSegment && eligibleDiscounts.length) {
    // Find the best discount among the ones specifically for this tier
    const bestTierDiscount = [...eligibleDiscounts]
      .filter(d => d.title && d.title.toLowerCase().startsWith('vice'))
      .sort((a: any, b: any) => {
        // Prioritize amount if percentage is 0, else prioritize percentage
        const aVal = a.percentage || 0;
        const bVal = b.percentage || 0;
        return bVal - aVal;
      })[0];

    if (bestTierDiscount) {
      membershipDiscount = bestTierDiscount;
    }
  }

  // Final check: if no specific membership discount was found but there are global ones, 
  // they will be handled by useMembership hook using the 'eligibleDiscounts' list.

  return {
    ...deferredData,
    customer,
    automaticDiscounts: eligibleDiscounts,
    membershipDiscount,
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

  const automaticDiscounts = (async () => {
    try {
      // console.log('Fetching automatic discounts via Admin API...');
      const response = await axiosShopifyAdmin.post("", {
        query: GET_AUTOMATIC_DISCOUNT_QUERY,
        variables: {
          first: 50,
          query: `status:active`
        }
      });

      const json = response.data;
      if (json.errors) {
        console.error('Admin API GraphQL Errors:', JSON.stringify(json.errors, null, 2));
        return [];
      }

      const nodes = json.data?.automaticDiscountNodes?.nodes || [];
      console.log('DEBUG: RAW DISCOUNT NODES:', JSON.stringify(nodes, null, 2));

      const mappedDiscounts = nodes.map((node: any) => {
        const ad = node.automaticDiscount;
        if (!ad) return null;

        // console.log(`DEBUG: Mapping discount: ${ad.title}`, ad.customerGets?.value);

        // Basic discounts have customerGets
        if (ad.customerGets) {
          const value = ad.customerGets.value;
          const items = ad.customerGets.items;

          let pct = value?.percentage ?? 0;
          if (typeof pct === 'number' && pct > 1) pct = pct / 100;

          return {
            title: ad.title,
            percentage: pct,
            amount: value?.amount ? parseFloat(value.amount.amount.replace(/,/g, '')) : null,
            currencyCode: value?.amount?.currencyCode || null,
            eligibleProducts: items?.products?.nodes?.map((p: any) => p.id) || [],
            eligibleCollections: items?.collections?.nodes?.map((c: any) => c.id) || [],
            appliesToAll: items?.__typename === 'AllDiscountItems',
            appliesOnEachItem: value?.percentage ? true : (value?.appliesOnEachItem ?? false)
          };
        }

        // BXGY or other types
        return {
          title: ad.title,
          percentage: 0,
          amount: null,
        };
      }).filter(Boolean);

      // console.log('Mapped Discounts (Titles):', mappedDiscounts.map((d: any) => d.title));
      return mappedDiscounts;
    } catch (e) {
      console.error('Error fetching automatic discounts:', e);
      return [];
    }
  })();

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    customer,
    automaticDiscounts,
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
        {/* Google Tag Manager */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W6J2ZCKK');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Meta Pixel Base Code */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `console.log('Meta Pixel Base Loaded');
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}
(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '912923441144845', {
  em: 'email@email.com', //Values will be hashed automatically by the pixel using SHA-256
  ph: '1234567890',
  fn: 'first_name',    
  ln: 'last_name'  
}); 
fbq('track', 'PageView');`,
          }}
        />
        {/* End Meta Pixel Base Code */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body className='font-sans'>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W6J2ZCKK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Meta Pixel Base Code (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=912923441144845&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Base Code (noscript) */}
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