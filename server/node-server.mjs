// server/node-server.mjs
import http from 'http';
import {createRequestHandler} from '@shopify/hydrogen/oxygen'; // same helper Hydrogen uses
// import any polyfills you need here

// 1) Dynamically import the built server bundle from dist
//    Confirm the path below matches what your build outputs (inspect /dist after build).
// const build = await import('../dist/server/index.js');
const build = await import('../dist/server/react-router.server.js')

// 2) create handler using the same API Hydrogen expects
const handleRequest = createRequestHandler({
  build,
  mode: process.env.NODE_ENV ?? 'production',
  // optionally provide getLoadContext if you had a Hydrogen context builder:
  // getLoadContext: () => ({ /* something */ }),
});

// 3) create an HTTP server
const server = http.createServer(async (req, res) => {
  try {
    // convert Node req/res to Request if needed (Hydrogen handler accepts Request)
    const {Readable} = await import('stream');
    const url = `http://${req.headers.host}${req.url}`;
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
    });
    const response = await handleRequest(request);
    // copy headers & status
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    // stream the body
    if (response.body) {
      const body = await response.text();
      res.end(body);
    } else {
      res.end();
    }
  } catch (err) {
    console.error('Server error', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Hydrogen Node server listening on http://localhost:${PORT}`);
});
