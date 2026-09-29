import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type { EntryContext } from 'react-router';

export const streamTimeout = 20_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },

    imgSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://cdn.sanity.io',
      'https://i.ytimg.com',
      'https://img.youtube.com',
      'https://www.googletagmanager.com',
      'https://*.clarity.ms',
      'https://www.facebook.com',
      'https://static.klaviyo.com',
      'https://a.klaviyo.com',
      // Yotpo
      'https://*.yotpo.com',
      'https://*.yotpoapi.com',
      'data:',
    ],

    connectSrc: [
      "'self'",
      'https://shopify.com',
      'https://*.shopify.com',
      'https://c248y25j.api.sanity.io',
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
      'https://*.clarity.ms',
      'https://www.facebook.com',
      'https://connect.facebook.net',
      'https://static.klaviyo.com',
      'https://a.klaviyo.com',
      'https://fast.a.klaviyo.com',
      'https://static-forms.klaviyo.com',
      'https://*.klaviyo.com',
      // Yotpo
      'https://*.yotpo.com',
      'https://cdn-widgetsrepository.yotpo.com',
      'https://staticw2.yotpo.com',
      'https://*.yotpoapi.com',
      'http://*.yotpoapi.com',
      'http://p.yotpoapi.com',
      'https://p.yotpoapi.com',
    ],

    mediaSrc: [
      "'self'",
      'https://cdn.sanity.io',
      'https://c248y25j.api.sanity.io',
      'https://www.youtube.com',
      'https://youtube.com',
      'https://*.googlevideo.com',
    ],

    frameSrc: [
      "'self'",
      'https://www.youtube.com',
      'https://youtube.com',
      'https://youtu.be', // ✅ add shortened YouTube domain
      'https://cdn.sanity.io', // ✅ allow Sanity-hosted videos in iframe
      'https://player.vimeo.com',
      'https://www.googletagmanager.com',
    ],

    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://www.googletagmanager.com',
      'https://*.clarity.ms',
      'https://connect.facebook.net',
      'https://static.klaviyo.com',
      'https://klaviyo.com',
      // Yotpo
      'https://cdn-widgetsrepository.yotpo.com',
      'https://staticw2.yotpo.com',
      'https://*.yotpo.com',
      "'sha256-s3SZTSyQxUKs/jb32OwDqhQD//UmajtRhqPKWi2BlbM='",
      "'sha256-ZHvi1PGvqzZ4VRdQO7VkiV7s1Y65GtErug8DAAzcHNY='",
      "'sha256-5q0ADi4wbx+5wxfG5iGAyEw/5EuQBTuMZ+y+XszyL60='",
      "'sha256-Gu6rs6nL+AhmxWqe1XDXeh23b4SlUAhBtx29TdXu49I='",
      "'strict-dynamic'",
      "https:",
      "http:",
    ],

    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Yotpo inline styles
      'https://cdn-widgetsrepository.yotpo.com',
      'https://staticw2.yotpo.com',
      'https://*.yotpo.com',
      // Google Fonts
      'https://fonts.googleapis.com',
    ],

    fontSrc: [
      "'self'",
      'https://cdn-widgetsrepository.yotpo.com',
      'https://staticw2.yotpo.com',
      'https://*.yotpo.com',
      // Google Fonts — gstatic serves the actual .woff2 font files
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'data:',
    ],

    defaultSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://cdn.sanity.io',
      'https://www.youtube.com',
      'https://youtube.com',
      'https://*.googlevideo.com',
    ],

  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  // Append upgrade-insecure-requests so the browser automatically upgrades
  // http:// sub-resource requests (e.g. Yotpo's http://p.yotpoapi.com tracker)
  // to https://, bypassing mixed-content blocking.
  responseHeaders.set('Content-Security-Policy', `${header}; upgrade-insecure-requests`);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}