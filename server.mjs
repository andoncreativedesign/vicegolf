import {createRequestHandler} from '@react-router/express';
import {createCookieSessionStorage} from 'react-router';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import {createHydrogenContext, InMemoryCache} from '@shopify/hydrogen';

// Load environment variables
import 'dotenv/config';



// Set APP_URL in process.env if not already set (for Hydrogen to pick up)
if (!process.env.APP_URL && process.env.NODE_ENV === 'development') {
  console.log('⚠️  APP_URL not found in process.env, this might cause redirect issues');
}

// Don't capture process.env too early - it needs to be accessed after dotenv loads
const getEnv = () => ({
  ...process.env,
  // Ensure required environment variables are present
  PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || '',
  PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
  PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID || '',
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID || '',
  PUBLIC_CUSTOMER_ACCOUNT_API_URL: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL || '',
  SESSION_SECRET: process.env.SESSION_SECRET || 'dev-session-secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.APP_URL || '',
});

let vite;
if (process.env.NODE_ENV !== 'production') {
  const {createServer} = await import('vite');
  vite = await createServer({
    server: {
      middlewareMode: true,
    },
    configFile: 'vite.config.ts',
  });
}

const app = express();

// Trust proxy to properly handle x-forwarded-* headers from ngrok
app.set('trust proxy', true);

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// handle asset requests
if (vite) {
  app.use(vite.middlewares);
} else {
  // add morgan here for production only
  // dev uses morgan plugin, otherwise it spams the console with HMR requests
  app.use(morgan('tiny'));
  // Serve static assets from dist/client/assets
  app.use(
    '/assets',
    express.static('dist/client/assets', {immutable: true, maxAge: '1y'}),
  );
}
// Serve static files from dist/client
app.use(express.static('dist/client', {maxAge: '1h'}));

// Create the request handler
app.all('*', async (req, res, next) => {
  // Create context with Express req object
  const context = await getContext(req);

  // Create handler with the context
  const handler = createRequestHandler({
    build: vite
      ? () => vite.ssrLoadModule('virtual:react-router/server-build')
      : await import('./dist/server/index.js'),
    mode: process.env.NODE_ENV,
    getLoadContext: () => context,
  });

  // Intercept the response to commit session
  const originalEnd = res.end;
  res.end = function(...args) {
    // Commit session before sending response
    if (context.session.session.data && Object.keys(context.session.session.data).length > 0) {
      context.session.commit().then(cookie => {
        if (cookie) {
          res.setHeader('Set-Cookie', cookie);
        }
        originalEnd.apply(res, args);
      }).catch(err => {
        console.error('Failed to commit session:', err);
        originalEnd.apply(res, args);
      });
    } else {
      originalEnd.apply(res, args);
    }
  };

  return handler(req, res, next);
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const newPort = parseInt(port) + 1;
    console.log(`Port ${port} is in use, trying ${newPort}...`);
    server.listen(newPort);
  } else {
    throw err;
  }
});

async function getContext(req) {
  const env = getEnv();
  const session = await AppSession.init(req, [env.SESSION_SECRET]);

  // Get the actual host from the request or use APP_URL
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  
  // Create proper Headers object
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
  }
  
  // Create a minimal Request object for Node.js
  const request = new Request(`${protocol}://${host}${req.url}`, {
    method: req.method,
    headers: headers,
  });

  // Ensure required environment variables are present
  if (!env.PUBLIC_STORE_DOMAIN) {
    console.error('Missing required environment variable: PUBLIC_STORE_DOMAIN');
    process.exit(1);
  }
  if (!env.PUBLIC_STOREFRONT_API_TOKEN) {
    console.error('Missing required environment variable: PUBLIC_STOREFRONT_API_TOKEN');
    process.exit(1);
  }

  // Determine the app URL - use APP_URL from env, or construct from request
  const appUrl = env.APP_URL || `${protocol}://${host}`;
  

  
  // Create Hydrogen context similar to skeleton, adapted for Node.js
  const hydrogenContext = createHydrogenContext(
    {
      env: {
        ...env,
        // Ensure the store domain is properly formatted
        PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        // Override APP_URL to ensure it's used
        APP_URL: appUrl,
      },
      request,
      cache: new InMemoryCache(),
      waitUntil: null, // Not applicable in Node.js
      session,
      i18n: {language: 'EN', country: 'US'},
      cart: {
        // Add a custom cart fragment if needed
        queryFragment: CUSTOM_CART_QUERY,
      },
    },
    // Additional context can be added here
    {},
  );

  return hydrogenContext;
}

const CUSTOM_CART_QUERY = `#graphql
  fragment CartApiQuery on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      edges {
        node {
          id
          quantity
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              availableForSale
              compareAtPrice {
                amount
                currencyCode
              }
              price {
                amount
                currencyCode
              }
              requiresShipping
              title
              image {
                id
                url
                altText
                width
                height
              }
              product {
                handle
                title
                id
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
    }
  }

`;

class AppSession {
  constructor(sessionStorage, session) {
    this.sessionStorage = sessionStorage;
    this.session = session;
  }

  static async init(request, secrets) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production' || process.env.APP_URL?.startsWith('https'),
        secrets,
      },
    });

    const session = await storage
      .getSession(request.get('Cookie'))
      .catch(() => storage.getSession());

    return new this(storage, session);
  }

  get(key) {
    return this.session.get(key);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  flash(key, value) {
    this.session.flash(key, value);
  }

  unset(key) {
    this.session.unset(key);
  }

  set(key, value) {
    this.session.set(key, value);
  }

  commit() {
    return this.sessionStorage.commitSession(this.session);
  }
}