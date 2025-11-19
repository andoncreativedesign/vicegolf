import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { ProductCard } from '~/components/ProductCard';
import { createCategoryQuery, GET_PRODUCTS_BY_COLLECTION, type ShopifyCollection, type ShopifyCollectionResponse } from '~/lib/shopify/product-queries';
import { getListingByCollectionHandle, getAllListings, type SanityListing } from '~/lib/sanity/products';
import { useEffect } from 'react';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.collection?.title ?? ''} Collection` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
  const { ids, handle } = params;

  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!ids) {
    throw redirect('/collections');
  }

  const decodedIds = JSON.parse(decodeURIComponent(ids));
  const decodedHandle = decodeURIComponent(handle);

  console.log('🔍 Debug: URL handle:', handle);
  console.log('🔍 Debug: Decoded handle:', decodedHandle);

  // Convert space-separated handle to Shopify format (golf-balls)
  const shopifyHandle = decodedHandle.toLowerCase().replace(/\s+/g, '-');
  console.log('🔍 Debug: Shopify handle format:', shopifyHandle);

  // Debug: Check all listings in Sanity
  await getAllListings();

  const [collection] = await Promise.all<ShopifyCollectionResponse>([
    storefront.query(GET_PRODUCTS_BY_COLLECTION, {
      variables: {
        // handle: createCategoryQuery(decodedIds),
        ids: decodedIds,
        ...paginationVariables
      },
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);


  console.log('\n\ngolf collection ')
  console.log(JSON.stringify(collection.nodes[0].products.edges))


  if (!collection) {
    throw new Response(`Collection ${decodedHandle} not found`, {
      status: 404,
    });
  }

  // const combineCollectionProducts = (collections: ShopifyCollectionResponse): ShopifyCollection => {
  //   if (!collections?.nodes?.length) {
  //     return null;
  //   }

  //   // If there's only one collection, return it as is
  //   if (collections.nodes.length === 1) {
  //     return collections.nodes[0];
  //   }

  //   // Get the first collection to use as a base
  //   const baseCollection = { ...collections.nodes[0] };

  //   // Combine all products from all collections
  //   const allEdges = collections.nodes.flatMap(collection =>
  //     collection.products?.edges || []
  //   );

  //   // Create a map to deduplicate products by ID
  //   const uniqueProducts = new Map();

  //   allEdges.forEach(edge => {
  //     if (edge?.node?.id && !uniqueProducts.has(edge.node.id)) {
  //       uniqueProducts.set(edge.node.id, edge);
  //     }
  //   });

  //   // Update the base collection with combined products
  //   return {
  //     ...baseCollection,
  //     products: {
  //       ...baseCollection.products,
  //       edges: Array.from(uniqueProducts.values())
  //     }
  //   };
  // }


  // In your loadCriticalData function:

  const combineCollectionProducts = (collections: ShopifyCollectionResponse): ShopifyCollection | null => {
    try {
      // Check if collections or nodes exist
      if (!collections?.nodes?.length) {
        console.log('No collections found');
        return null;
      }

      console.log('Processing collections:', JSON.stringify(collections.nodes, null, 2));

      // Filter out any null/undefined collections
      const validCollections = collections.nodes.filter(
        collection => collection?.products?.edges?.length > 0
      );

      if (validCollections.length === 0) {
        console.log('No valid collections with products found');
        return null;
      }

      // If there's only one valid collection, return it as is
      if (validCollections.length === 1) {
        console.log('Single collection found, returning as is');
        return validCollections[0];
      }

      // Get the first collection to use as a base
      const baseCollection = { ...validCollections[0] };

      // Combine all products from all valid collections
      const allEdges = validCollections.flatMap(collection => {
        if (!collection?.products?.edges) return [];
        return collection.products.edges.filter(edge => edge?.node);
      });

      // Create a map to deduplicate products by ID
      const uniqueProducts = new Map();
      allEdges.forEach(edge => {
        if (edge?.node?.id) {
          uniqueProducts.set(edge.node.id, edge);
        }
      });

      console.log(`Combined ${allEdges.length} products into ${uniqueProducts.size} unique products`);

      // Update the base collection with combined products
      const result = {
        ...baseCollection,
        products: {
          ...baseCollection.products,
          edges: Array.from(uniqueProducts.values()),
          pageInfo: baseCollection.products?.pageInfo || {
            hasNextPage: false,
            hasPreviousPage: false
          }
        }
      };

      return result;
    } catch (error) {
      console.error('Error combining collections:', error);
      return null;
    }
  };

  const updatedCollection = combineCollectionProducts(collection);

  console.log("\n\nupdatedCollection?.products data")
  console.log(updatedCollection?.products)

  // Fetch Sanity listing data for this collection using Shopify handle format
  const listingData = await getListingByCollectionHandle(shopifyHandle);

  return {
    collection: updatedCollection,
    handle: decodedHandle,
    listing: listingData
  };

}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const { collection, handle, listing } = useLoaderData<typeof loader>();

  useEffect(() => {
    console.log("collections data get by ids", collection)
    console.log("listing data from sanity", listing)
  }, [collection, listing])

  const hasProducts = Boolean(
    collection?.products?.edges?.some((edge) => edge?.node)
  );

  return (
    <div className="collection">
      {/* Display Sanity listing content if available */}
      {listing && (
        <div className="listing-content mb-8">
          <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
          {listing.subtitle && (
            <h2 className="text-2xl font-semibold mb-4 text-gray-600">{listing.subtitle}</h2>
          )}
          {listing.description && (
            <div className="collection-description mb-6 text-gray-700 max-w-4xl">
              <p>{listing.description}</p>
            </div>
          )}

          {/* Display listing images */}
          {listing.images && listing.images.length > 0 && (
            <div className="listing-images mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listing.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image.asset.url}
                      alt={image.alt || listing.title}
                      className="w-full h-full object-cover rounded-lg"
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display listing videos */}
          {listing.videos && listing.videos.length > 0 && (
            <div className="listing-videos mb-8">
              <h3 className="text-xl font-semibold mb-4">Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.videos.map((video, index) => (
                  <div key={index} className="video-container">
                    {video.title && <h4 className="font-medium mb-2">{video.title}</h4>}
                    {video.description && <p className="text-gray-600 mb-2">{video.description}</p>}
                    <video
                      controls
                      className="w-full rounded-lg"
                      preload="metadata"
                    >
                      <source src={video.asset.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fallback to original collection header if no listing data */}
      {!listing && (
        <>
          <h1>{handle}</h1>
          <p className="collection-description">{collection?.description}</p>
        </>
      )}

      {/* Products section */}
      {collection?.products && hasProducts && (
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="products-grid"
        >
          {({ node: product, index }) => (
            product ? (
              <ProductCard
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            ) : null
          )}
        </PaginatedResourceSection>
      )}

      {!hasProducts && (
        <p className="mt-6 text-center text-gray-500 text-sm">
          No products found in this collection.
        </p>
      )}

      {collection?.id && collection?.handle &&
        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
        />
      }
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
