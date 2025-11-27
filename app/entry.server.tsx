// import {ServerRouter} from 'react-router';
// import {isbot} from 'isbot';
// import {renderToReadableStream} from 'react-dom/server';
// import {
//   createContentSecurityPolicy,
//   type HydrogenRouterContextProvider,
// } from '@shopify/hydrogen';
// import type { EntryContext } from 'react-router';


// export default async function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   reactRouterContext: EntryContext,
//   context: HydrogenRouterContextProvider,
// ) {
//   const {nonce, header, NonceProvider} = createContentSecurityPolicy({
//     shop: {
//       checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
//       storeDomain: context.env.PUBLIC_STORE_DOMAIN,
//     },

//     imgSrc: [
//       "'self'",
//       'https://cdn.shopify.com',
//       'https://cdn.sanity.io',
//       'https://i.ytimg.com',
//       'https://img.youtube.com',
//       'data:',
//     ],

//     connectSrc: [
//       "'self'",
//       'https://shopify.com',
//       'https://*.shopify.com',
//       'https://c248y25j.api.sanity.io',
//     ],

//     mediaSrc: [
//       "'self'",
//       'https://cdn.sanity.io',
//       'https://c248y25j.api.sanity.io',
//       'https://www.youtube.com',
//       'https://youtube.com',
//       'https://*.googlevideo.com',
//     ],

//     frameSrc: [
//       "'self'",
//       'https://www.youtube.com',
//       'https://youtube.com',
//       'https://youtu.be', // ✅ add shortened YouTube domain
//       'https://cdn.sanity.io', // ✅ allow Sanity-hosted videos in iframe
//       'https://player.vimeo.com',
//     ],

//     defaultSrc: [
//       "'self'",
//       'https://cdn.shopify.com',
//       'https://cdn.sanity.io',
//       'https://www.youtube.com',
//       'https://youtube.com',
//       'https://*.googlevideo.com',
//     ],

//   });

//   const body = await renderToReadableStream(
//     <NonceProvider>
//       <ServerRouter
//         context={reactRouterContext}
//         url={request.url}
//         nonce={nonce}
//       />
//     </NonceProvider>,
//     {
//       nonce,
//       signal: request.signal,
//       onError(error) {
//         console.error(error);
//         responseStatusCode = 500;
//       },
//     },
//   );

//   if (isbot(request.headers.get('user-agent'))) {
//     await body.allReady;
//   }

//   responseHeaders.set('Content-Type', 'text/html');
//   responseHeaders.set('Content-Security-Policy', header);

//   return new Response(body, {
//     headers: responseHeaders,
//     status: responseStatusCode,
//   });
// }


// ! version from the doccs
// import { PassThrough } from 'node:stream';
// import type { EntryContext } from 'react-router';
// import { createReadableStreamFromReadable } from '@react-router/node';
// import { ServerRouter } from 'react-router';
// import { isbot } from 'isbot';
// import type { RenderToPipeableStreamOptions } from 'react-dom/server';
// import { renderToPipeableStream } from 'react-dom/server';
// import {
//   createContentSecurityPolicy,
//   type HydrogenRouterContextProvider,
// } from '@shopify/hydrogen';

// const ABORT_DELAY = 5_000;

// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   reactRouterContext: EntryContext,
//   context: HydrogenRouterContextProvider,
// ) {
//   return new Promise((resolve, reject) => {
//     const { nonce, header, NonceProvider } = createContentSecurityPolicy({
//       shop: {
//         checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
//         storeDomain: context.env.PUBLIC_STORE_DOMAIN,
//       },

//     });




//     let shellRendered = false;
//     const userAgent = request.headers.get('user-agent');

//     const readyOption: keyof RenderToPipeableStreamOptions =
//       userAgent && isbot(userAgent) ? 'onAllReady' : 'onShellReady';

//     const { pipe, abort } = renderToPipeableStream(
//       <NonceProvider>
//         <ServerRouter
//           context={reactRouterContext}
//           url={request.url}
//           nonce={nonce}
//         />
//       </NonceProvider>,
//       {
//         nonce,
//         [readyOption]() {
//           shellRendered = true;
//           const body = new PassThrough();
//           const stream = createReadableStreamFromReadable(body);

//           responseHeaders.set('Content-Type', 'text/html');
//           responseHeaders.set('Content-Security-Policy', header);

//           resolve(
//             new Response(stream, {
//               headers: responseHeaders,
//               status: responseStatusCode,
//             }),
//           );

//           pipe(body);
//         },
//         onShellError(error: unknown) {
//           reject(error);
//         },
//         onError(error: unknown) {
//           responseStatusCode = 500;
//           if (shellRendered) {
//             console.error(error);
//           }
//         },
//       },
//     );

//     setTimeout(abort, ABORT_DELAY);
//   });
// }


import { PassThrough } from 'node:stream';
import type { EntryContext } from 'react-router';
import { createReadableStreamFromReadable } from '@react-router/node';
import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  return new Promise((resolve, reject) => {
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
        'data:',
      ],

      connectSrc: [
        "'self'",
        'https://shopify.com',
        'https://*.shopify.com',
        'https://c248y25j.api.sanity.io',
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
        'https://youtu.be',
        'https://cdn.sanity.io',
        'https://player.vimeo.com',
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

    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");

    const readyOption: keyof RenderToPipeableStreamOptions =
      userAgent && isbot(userAgent) ? "onAllReady" : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider>
        <ServerRouter
          context={reactRouterContext}
          url={request.url}
          nonce={nonce}
        />
      </NonceProvider>,
      {
        nonce,

        [readyOption]() {
          shellRendered = true;

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");
          responseHeaders.set("Content-Security-Policy", header);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },

        onShellError(error) {
          reject(error);
        },

        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
