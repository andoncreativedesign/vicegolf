// Virtual entry point for the app
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/hydrogen/oxygen';
import {createHydrogenRouterContext} from '~/lib/context';

/**
 * Restricted country codes blocked at the edge from accessing storefront SSR.
 * Identified via Oxygen/Cloudflare geo headers ('oxygen-buyer-country' or 'cf-ipcountry').
 */
const BLOCKED_COUNTRIES = new Set(['CN']);

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      // Edge Security: Block restricted traffic (CN) before executing SSR
      const oxygenCountry = request.headers.get('oxygen-buyer-country')?.toUpperCase() || '';
      const cfCountry = request.headers.get('cf-ipcountry')?.toUpperCase() || '';

      if (BLOCKED_COUNTRIES.has(oxygenCountry) || BLOCKED_COUNTRIES.has(cfCountry)) {
        return new Response('Access Denied', {
          status: 403,
          statusText: 'Forbidden',
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        });
      }

      const url = new URL(request.url);

      // 301 canonical redirect: /en-ae/* → /* (UAE flagship serves from root)
      if (url.pathname === '/en-ae' || url.pathname.startsWith('/en-ae/')) {
        url.pathname = url.pathname.replace(/^\/en-ae(\/|$)/, '/');
        return Response.redirect(url.toString(), 301);
      }

      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        // eslint-disable-next-line import/no-unresolved
        build: await import('virtual:react-router/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.append(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }
      
      const cookies = response.headers.getSetCookie ? response.headers.getSetCookie() : response.headers.get('Set-Cookie');
      // console.log('--- DEBUG COOKIES at end of server.ts ---', cookies);

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
