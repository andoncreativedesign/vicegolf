import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {getLocaleFromRequest} from '~/lib/i18n';
import {transformPrices} from '~/lib/currency';

// Define the additional context object
const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
  // These will be available as both context.propertyName and context.get(propertyContext)
  // Example of complex objects that could be added:
  // cms: await createCMSClient(env),
  // reviews: await createReviewsClient(env),
} as const;

// Automatically augment HydrogenAdditionalContext with the additional context type
type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 * */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const locale = getLocaleFromRequest(request);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // Or detect from URL path based on locale subpath, cookies, or any other strategy
      i18n: locale,
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext,
  );

  // Link the customer account to the cart handler
  // This is required for segment-based discounts to work automatically
  if (hydrogenContext.cart && hydrogenContext.customerAccount) {
    (hydrogenContext.cart as any).customerAccount = hydrogenContext.customerAccount;
  }

  // Intercept Storefront API price responses for multi-region currency conversion
  // NOTE: Automatically bypassed once Shopify Markets is enabled in Shopify Admin
  if (locale.country !== 'AE' && hydrogenContext.storefront) {
    const originalQuery = hydrogenContext.storefront.query.bind(hydrogenContext.storefront);
    hydrogenContext.storefront.query = async (...args: any[]) => {
      const data = await (originalQuery as any)(...args);
      return transformPrices(data, locale.country);
    };

    const originalMutate = hydrogenContext.storefront.mutate.bind(hydrogenContext.storefront);
    hydrogenContext.storefront.mutate = async (...args: any[]) => {
      const data = await (originalMutate as any)(...args);
      return transformPrices(data, locale.country);
    };
  }

  return hydrogenContext;
}
