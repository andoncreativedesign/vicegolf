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
import { GET_AUTOMATIC_DISCOUNT_QUERY } from '~/graphql/admin/DiscountQuery';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';

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
  const [customer, plusDiscount] = await Promise.all([
    deferredData.customer,
    deferredData.plusDiscount
  ]);

  console.log('Loader returning Plus Discount:', plusDiscount);

  return {
    ...deferredData,
    customer,
    plusDiscount,
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

  const plusDiscount = (async () => {
    const { env } = context;
    if (!env.ADMIN_API_URL || !env.ADMIN_ACCESS_TOKEN) {
      console.warn('Admin API credentials missing, using fallback discount');
      return { percentage: 0, amount: null, currencyCode: null };
    }

    try {
      const adminApiUrl = `${env.ADMIN_API_URL}/graphql.json`;

      const response = await axiosShopifyAdmin.post(adminApiUrl, {
        query: GET_AUTOMATIC_DISCOUNT_QUERY,
        variables: {
          query: "title:'Automatic Discount' status:active"
        }
      }, {
        headers: {
          'X-Shopify-Access-Token': env.ADMIN_ACCESS_TOKEN,
        }
      });

      const json = response.data;
      const nodes = json.data?.automaticDiscountNodes?.nodes || [];

      console.log('\n\n--- ROOT DISCOUNT API NODES ---');
      console.log(JSON.stringify(nodes, null, 2));
      console.log('-----------------------------------\n');

      // Find THE specific discount titled 'Automatic Discount'
      const targetDiscountNode = nodes.find((node: any) =>
        node?.automaticDiscount?.title === 'Automatic Discount'
      );

      if (targetDiscountNode) {
        const value = targetDiscountNode.automaticDiscount?.customerGets?.value;
        if (value?.percentage) {
          const percentage = value.percentage;
          console.log(`Found Plus Discount (percentage): ${percentage * 100}%`);
          return { percentage, amount: null, currencyCode: null };
        } else if (value?.amount) {
          const amountValue = parseFloat(value.amount.amount);
          console.log(`Found Plus Discount (fixed amount): ${amountValue} ${value.amount.currencyCode}`);
          return {
            percentage: 0,
            amount: amountValue,
            currencyCode: value.amount.currencyCode
          };
        }
      }

      console.log('No matching automatic discount found, using fallback 0%');
      return { percentage: 0, amount: null, currencyCode: null };
    } catch (e) {
      console.error('Error fetching plus discount:', e);
      return { percentage: 0, amount: null, currencyCode: null };
    }
  })();

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    customer,
    plusDiscount,
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