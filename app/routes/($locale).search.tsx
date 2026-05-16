// import { useLoaderData, data } from 'react-router';
// import type { Route } from './+types/search';
// import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
// import { SearchForm } from '~/components/SearchForm';
// import { SearchResults } from '~/components/SearchResults';
// import {
//   type RegularSearchReturn,
//   type PredictiveSearchReturn,
//   getEmptyPredictiveSearchResult,
// } from '~/lib/search';
// import type {
//   RegularSearchQuery,
//   PredictiveSearchQuery,
// } from 'storefrontapi.generated';

// export const meta: Route.MetaFunction = () => {
//   return [{ title: `Vice Golf | Search` }];
// };

// export async function loader({ request, context }: Route.LoaderArgs) {
//   const url = new URL(request.url);
//   const isPredictive = url.searchParams.has('predictive');

//   try {
//     if (isPredictive) {
//       // For predictive (fetch) requests, return a proper Response so the
//       // worker can finalize the stream without crossing request contexts.
//       const result = await predictiveSearch({ request, context });
//       console.log('predictive search result: ', result);
//       return data(
//         { ...result, url: request.url },
//         { headers: { 'Cache-Control': 'no-store' } },
//       );
//     }

//     const result = await regularSearch({ request, context });
//     console.log('regular search result: ', result);
//     return { ...result, url: request.url };
//   } catch (error: any) {
//     // AbortError means the client cancelled – return an empty result quietly.
//     if (error?.name === 'AbortError') {
//       return data(
//         {
//           type: isPredictive ? 'predictive' : 'regular',
//           term: String(url.searchParams.get('q') || ''),
//           result: isPredictive ? getEmptyPredictiveSearchResult() : null,
//           url: request.url,
//         },
//         { headers: { 'Cache-Control': 'no-store' } },
//       );
//     }
//     console.error('Search loader error:', error);
//     return data(
//       {
//         type: isPredictive ? 'predictive' : 'regular',
//         term: String(url.searchParams.get('q') || ''),
//         result: isPredictive ? getEmptyPredictiveSearchResult() : null,
//         error: error?.message || String(error),
//         url: request.url,
//       },
//       { headers: { 'Cache-Control': 'no-store' } },
//     );
//   }
// }

// /**
//  * Renders the /search route
//  */
// export default function SearchPage() {
//   const { type, term, result, error } = useLoaderData<typeof loader>();
//   if (type === 'predictive') return null;

//   return (
//     <div className="search lg:mx-16 sm:mx-8">
//       <div className="search-container flex justify-center">
//         <SearchForm>
//           {({ inputRef }) => (
//             <div className="search-input-container">
//               <input
//                 className="search-input"
//                 defaultValue={term}
//                 name="q"
//                 placeholder="Search products..."
//                 ref={inputRef}
//                 type="text"
//                 autoComplete="off"
//               />
//               {term && (
//                 <button
//                   type="button"
//                   className="clear-search"
//                   onClick={() => {
//                     if (inputRef.current) {
//                       inputRef.current.value = '';
//                       inputRef.current.focus();
//                       // Trigger search update
//                       const event = new Event('input', { bubbles: true });
//                       inputRef.current.dispatchEvent(event);
//                     }
//                   }}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <line x1="18" y1="6" x2="6" y2="18"></line>
//                     <line x1="6" y1="6" x2="18" y2="18"></line>
//                   </svg>
//                 </button>
//               )}
//             </div>
//           )}
//         </SearchForm>
//       </div>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {!term || !result?.total ? (
//         <SearchResults.Empty />
//       ) : (
//         <SearchResults result={result} term={term}>
//           {({ articles, pages, products, term }) => (
//             <div>
//               <SearchResults.Products products={products} term={term} />
//               <SearchResults.Pages pages={pages} term={term} />
//               <SearchResults.Articles articles={articles} term={term} />
//             </div>
//           )}
//         </SearchResults>
//       )}
//       <Analytics.SearchView data={{ searchTerm: term, searchResults: result }} />
//     </div>
//   );
// }

// /**
//  * Regular search query and fragments
//  * (adjust as needed)
//  */
// const SEARCH_PRODUCT_FRAGMENT = `#graphql
//   fragment SearchProduct on Product {
//     __typename
//     handle
//     id
//     publishedAt
//     title
//     trackingParameters
//     vendor
//     selectedOrFirstAvailableVariant(
//       selectedOptions: []
//       ignoreUnknownOptions: true
//       caseInsensitiveMatch: true
//     ) {
//       id
//       image {
//         url
//         altText
//         width
//         height
//       }
//       price {
//         amount
//         currencyCode
//       }
//       compareAtPrice {
//         amount
//         currencyCode
//       }
//       selectedOptions {
//         name
//         value
//       }
//       product {
//         handle
//         title
//       }
//     }
//   }
// ` as const;

// const SEARCH_PAGE_FRAGMENT = `#graphql
//   fragment SearchPage on Page {
//      __typename
//      handle
//     id
//     title
//     trackingParameters
//   }
// ` as const;

// const SEARCH_ARTICLE_FRAGMENT = `#graphql
//   fragment SearchArticle on Article {
//     __typename
//     handle
//     id
//     title
//     trackingParameters
//   }
// ` as const;

// const PAGE_INFO_FRAGMENT = `#graphql
//   fragment PageInfoFragment on PageInfo {
//     hasNextPage
//     hasPreviousPage
//     startCursor
//     endCursor
//   }
// ` as const;

// // NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
// export const SEARCH_QUERY = `#graphql
//   query RegularSearch(
//     $country: CountryCode
//     $endCursor: String
//     $first: Int
//     $language: LanguageCode
//     $last: Int
//     $term: String!
//     $startCursor: String
//   ) @inContext(country: $country, language: $language) {
//     articles: search(
//       query: $term,
//       types: [ARTICLE],
//       first: $first,
//     ) {
//       nodes {
//         ...on Article {
//           ...SearchArticle
//         }
//       }
//     }
//     pages: search(
//       query: $term,
//       types: [PAGE],
//       first: $first,
//     ) {
//       nodes {
//         ...on Page {
//           ...SearchPage
//         }
//       }
//     }
//     products: search(
//       after: $endCursor,
//       before: $startCursor,
//       first: $first,
//       last: $last,
//       query: $term,
//       sortKey: RELEVANCE,
//       types: [PRODUCT],
//       unavailableProducts: HIDE,
//     ) {
//       nodes {
//         ...on Product {
//           ...SearchProduct
//         }
//       }
//       pageInfo {
//         ...PageInfoFragment
//       }
//     }
//   }
//   ${SEARCH_PRODUCT_FRAGMENT}
//   ${SEARCH_PAGE_FRAGMENT}
//   ${SEARCH_ARTICLE_FRAGMENT}
//   ${PAGE_INFO_FRAGMENT}
// ` as const;

// /**
//  * Regular search fetcher
//  */
// async function regularSearch({
//   request,
//   context,
// }: Pick<
//   Route.LoaderArgs,
//   'request' | 'context'
// >): Promise<RegularSearchReturn> {
//   const { storefront } = context;
//   const url = new URL(request.url);
//   const variables = getPaginationVariables(request, { pageBy: 8 });
//   const term = String(url.searchParams.get('q') || '').trim();

//   if (!term) {
//     return {
//       type: 'regular',
//       term: '',
//       result: { total: 0, items: { articles: { nodes: [] }, pages: { nodes: [] }, products: { nodes: [], pageInfo: {} } } },
//     } as any;
//   }

//   // Search articles, pages, and products for the `q` term
//   const {
//     errors,
//     ...items
//   }: { errors?: Array<{ message: string }> } & RegularSearchQuery =
//     await storefront.query(SEARCH_QUERY, {
//       variables: { ...variables, term },
//     });

//   if (!items) {
//     throw new Error('No search data returned from Shopify API');
//   }

//   const total = Object.values(items).reduce(
//     (acc: number, item: any) => acc + (item?.nodes?.length || 0),
//     0,
//   );

//   const error = errors
//     ? errors.map(({ message }: { message: string }) => message).join(', ')
//     : undefined;

//   return { type: 'regular', term, error, result: { total, items } };
// }

// /**
//  * Predictive search query and fragments
//  * (adjust as needed)
//  */
// const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
//   fragment PredictiveArticle on Article {
//     __typename
//     id
//     title
//     handle
//     blog {
//       handle
//     }
//     image {
//       url
//       altText
//       width
//       height
//     }
//     trackingParameters
//   }
// ` as const;

// const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
//   fragment PredictiveCollection on Collection {
//     __typename
//     id
//     title
//     handle
//     image {
//       url
//       altText
//       width
//       height
//     }
//     trackingParameters
//   }
// ` as const;

// const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
//   fragment PredictivePage on Page {
//     __typename
//     id
//     title
//     handle
//     trackingParameters
//   }
// ` as const;

// const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
//   fragment PredictiveProduct on Product {
//     __typename
//     id
//     title
//     handle
//     trackingParameters
//     selectedOrFirstAvailableVariant(
//       selectedOptions: []
//       ignoreUnknownOptions: true
//       caseInsensitiveMatch: true
//     ) {
//       id
//       image {
//         url
//         altText
//         width
//         height
//       }
//       price {
//         amount
//         currencyCode
//       }
//     }
//   }
// ` as const;

// const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
//   fragment PredictiveQuery on SearchQuerySuggestion {
//     __typename
//     text
//     styledText
//     trackingParameters
//   }
// ` as const;

// // NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
// const PREDICTIVE_SEARCH_QUERY = `#graphql
//   query PredictiveSearch(
//     $country: CountryCode
//     $language: LanguageCode
//     $limit: Int!
//     $limitScope: PredictiveSearchLimitScope!
//     $term: String!
//     $types: [PredictiveSearchType!]
//   ) @inContext(country: $country, language: $language) {
//     predictiveSearch(
//       limit: $limit,
//       limitScope: $limitScope,
//       query: $term,
//       types: $types,
//     ) {
//       articles {
//         ...PredictiveArticle
//       }
//       collections {
//         ...PredictiveCollection
//       }
//       pages {
//         ...PredictivePage
//       }
//       products {
//         ...PredictiveProduct
//       }
//       queries {
//         ...PredictiveQuery
//       }
//     }
//   }
//   ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
//   ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
//   ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
//   ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
//   ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
// ` as const;

// /**
//  * Predictive search fetcher.
//  *
//  * Uses Promise.race() against the request's AbortSignal so that when the
//  * browser cancels the fetch (e.g. rapid typing), the loader returns an empty
//  * result immediately rather than leaving a dangling promise that mini-oxygen
//  * cannot resolve — which would cause the "script will never generate a
//  * response" 500 error.
//  */
// async function predictiveSearch({
//   request,
//   context,
// }: Pick<
//   Route.LoaderArgs,
//   'request' | 'context'
// >): Promise<PredictiveSearchReturn> {
//   const { storefront } = context;
//   const url = new URL(request.url);
//   const term = String(url.searchParams.get('q') || '').trim();
//   const limit = Number(url.searchParams.get('limit') || 10);
//   const type = 'predictive';

//   if (!term) return { type, term, result: getEmptyPredictiveSearchResult() };

//   // Build a promise that rejects as soon as the client aborts the request.
//   // This lets us escape before mini-oxygen detects the hanging promise.
//   const abortPromise = new Promise<never>((_, reject) => {
//     const onAbort = () =>
//       reject(new DOMException('Request aborted', 'AbortError'));
//     if (request.signal.aborted) {
//       onAbort();
//       return;
//     }
//     request.signal.addEventListener('abort', onAbort, { once: true });
//   });

//   // Race the actual storefront query against the abort signal.
//   const {
//     predictiveSearch: items,
//     errors,
//   }: PredictiveSearchQuery & { errors?: Array<{ message: string }> } =
//     await Promise.race([
//       storefront.query(PREDICTIVE_SEARCH_QUERY, {
//         variables: {
//           limit,
//           limitScope: 'EACH',
//           term,
//         },
//       }),
//       abortPromise,
//     ]);

//   if (errors) {
//     throw new Error(
//       `Shopify API errors: ${errors
//         .map(({ message }: { message: string }) => message)
//         .join(', ')}`,
//     );
//   }

//   if (!items) {
//     throw new Error('No predictive search data returned from Shopify API');
//   }

//   const total = Object.values(items).reduce(
//     (acc: number, item: any) => acc + (Array.isArray(item) ? item.length : 0),
//     0,
//   );

//   return { type, term, result: { items, total } };
// }

import { useLoaderData, data } from 'react-router';
import type { Route } from './+types/search';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { SearchForm } from '~/components/SearchForm';
import { SearchResults } from '~/components/SearchResults';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';
import type {
  RegularSearchQuery,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{ title: `Vice Golf | Search` }];
};

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');

  if (request.signal.aborted) {
    return emptyResponse(isPredictive, url);
  }

  try {
    if (isPredictive) {
      const result = await predictiveSearch({ request, context });
      if (request.signal.aborted) {
        return emptyResponse(isPredictive, url);
      }
      return data(
        { ...result, url: request.url },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const result = await regularSearch({ request, context });
    if (request.signal.aborted) {
      return emptyResponse(isPredictive, url);
    }
    return { ...result, url: request.url };

  } catch (error: any) {
    if (
      error?.name === 'AbortError' ||
      error?.message?.includes('aborted') ||
      request.signal.aborted
    ) {
      return emptyResponse(isPredictive, url);
    }
    console.error('Search loader error:', error);
    return data(
      {
        type: isPredictive ? 'predictive' : 'regular',
        term: String(url.searchParams.get('q') || ''),
        result: isPredictive ? getEmptyPredictiveSearchResult() : null,
        error: error?.message || String(error),
        url: request.url,
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

/** Always-200 empty response for aborted / cancelled requests */
function emptyResponse(isPredictive: boolean, url: URL) {
  return data(
    {
      type: isPredictive ? 'predictive' : 'regular',
      term: String(url.searchParams.get('q') || ''),
      result: isPredictive ? getEmptyPredictiveSearchResult() : null,
      url: url.href,
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  );
}

// ---------------------------------------------------------------------------
// Search page UI
// ---------------------------------------------------------------------------

export default function SearchPage() {
  const { type, term, result, error } = useLoaderData<typeof loader>();
  if (type === 'predictive') return null;

  return (
    <div className="search lg:mx-16 sm:mx-8">
      <div className="search-container flex justify-center">
        <SearchForm>
          {({ inputRef }) => (
            <div className="search-input-container">
              <input
                className="search-input"
                defaultValue={term}
                name="q"
                placeholder="Search products..."
                ref={inputRef}
                type="text"
                autoComplete="off"
              />
              {term && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.value = '';
                      inputRef.current.focus();
                      const event = new Event('input', { bubbles: true });
                      inputRef.current.dispatchEvent(event);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          )}
        </SearchForm>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!term || !result?.total ? (
        <SearchResults.Empty />
      ) : (
        <SearchResults result={result} term={term}>
          {({ articles, pages, products, term }) => (
            <div>
              <SearchResults.Products products={products} term={term} />
              <SearchResults.Pages pages={pages} term={term} />
              <SearchResults.Articles articles={articles} term={term} />
            </div>
          )}
        </SearchResults>
      )}
      <Analytics.SearchView data={{ searchTerm: term, searchResults: result }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// GraphQL fragments — Regular search
// ---------------------------------------------------------------------------

const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image { url altText width height }
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      selectedOptions { name value }
      product { handle title }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
    __typename handle id title trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename handle id title trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage hasPreviousPage startCursor endCursor
  }
` as const;

export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(query: $term, types: [ARTICLE], first: $first) {
      nodes { ...on Article { ...SearchArticle } }
    }
    pages: search(query: $term, types: [PAGE], first: $first) {
      nodes { ...on Page { ...SearchPage } }
    }
    products: search(
      after: $endCursor before: $startCursor first: $first last: $last
      query: $term sortKey: RELEVANCE types: [PRODUCT] unavailableProducts: HIDE
    ) {
      nodes { ...on Product { ...SearchProduct } }
      pageInfo { ...PageInfoFragment }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

// ---------------------------------------------------------------------------
// Regular search fetcher
// ---------------------------------------------------------------------------

async function regularSearch({
  request,
  context,
}: Pick<Route.LoaderArgs, 'request' | 'context'>): Promise<RegularSearchReturn> {
  const { storefront } = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, { pageBy: 8 });
  const term = String(url.searchParams.get('q') || '').trim();

  if (!term) {
    return {
      type: 'regular',
      term: '',
      result: {
        total: 0,
        items: {
          articles: { nodes: [] },
          pages: { nodes: [] },
          products: { nodes: [], pageInfo: {} },
        },
      },
    } as any;
  }

  const { errors, ...items }: { errors?: Array<{ message: string }> } & RegularSearchQuery =
    await storefront.query(SEARCH_QUERY, { variables: { ...variables, term } });

  if (!items) throw new Error('No search data returned from Shopify API');

  const total = Object.values(items).reduce(
    (acc: number, item: any) => acc + (item?.nodes?.length || 0),
    0,
  );

  const error = errors
    ? errors.map(({ message }: { message: string }) => message).join(', ')
    : undefined;

  return { type: 'regular', term, error, result: { total, items } };
}

// ---------------------------------------------------------------------------
// GraphQL fragments — Predictive search
// ---------------------------------------------------------------------------

const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename id title handle
    blog { handle }
    image { url altText width height }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename id title handle
    image { url altText width height }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename id title handle trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename id title handle trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image { url altText width height }
      price { amount currencyCode }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename text styledText trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(limit: $limit limitScope: $limitScope query: $term types: $types) {
      articles { ...PredictiveArticle }
      collections { ...PredictiveCollection }
      pages { ...PredictivePage }
      products { ...PredictiveProduct }
      queries { ...PredictiveQuery }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

// ---------------------------------------------------------------------------
// Predictive search fetcher
// ---------------------------------------------------------------------------

async function predictiveSearch({
  request,
  context,
}: Pick<Route.LoaderArgs, 'request' | 'context'>): Promise<PredictiveSearchReturn> {
  const { storefront } = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return { type, term, result: getEmptyPredictiveSearchResult() };

  // Race the storefront query against the request abort signal.
  // This ensures we return before mini-oxygen detects a hanging promise.
  const abortPromise = new Promise<never>((_, reject) => {
    if (request.signal.aborted) {
      reject(Object.assign(new Error('Request aborted'), { name: 'AbortError' }));
      return;
    }
    request.signal.addEventListener(
      'abort',
      () => reject(Object.assign(new Error('Request aborted'), { name: 'AbortError' })),
      { once: true },
    );
  });

  // KEY FIX: pass request.signal into storefront.query().
  // This makes the underlying fetch() abort at the network level when the
  // client cancels, so the promise is truly killed — not just raced past.
  // mini-oxygen tracks ALL promises in the request context, so a still-running
  // storefront.query() after a race resolves still causes the cross-context error.
  const queryResult: PredictiveSearchQuery & { errors?: Array<{ message: string }> } =
    await storefront.query(PREDICTIVE_SEARCH_QUERY, {
      variables: { limit, limitScope: 'EACH', term },
      // ✅ This is the critical addition:
      signal: request.signal,
    });

  // No need for Promise.race() anymore — the signal propagates cancellation
  // all the way into the fetch inside storefront.query().

  const { predictiveSearch: items, errors } = queryResult;

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({ message }) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, item: any) => acc + (Array.isArray(item) ? item.length : 0),
    0,
  );

  return { type, term, result: { items, total } };
}
