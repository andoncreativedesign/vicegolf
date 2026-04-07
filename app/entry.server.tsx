import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type { EntryContext } from 'react-router';


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
      "'sha256-s3SZTSyQxUKs/jb32OwDqhQD//UmajtRhqPKWi2BlbM='",
      "'sha256-ZHvi1PGvqzZ4VRdQO7VkiV7s1Y65GtErug8DAAzcHNY='",
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
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}