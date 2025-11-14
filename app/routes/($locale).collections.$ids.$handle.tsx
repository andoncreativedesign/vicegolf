import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { ProductCard } from '~/components/ProductCard';
import { createCategoryQuery, GET_PRODUCTS_BY_COLLECTION, type ShopifyCollection, type ShopifyCollectionResponse } from '~/lib/shopify/product-queries';
import { useEffect } from 'react';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.collection.title ?? ''} Collection` }];
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
  const decodedHandle = decodeURIComponent(handle)

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

  return {
    collection: updatedCollection,
    handle: decodedHandle
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
  const { collection, handle } = useLoaderData<typeof loader>(); 
  
  useEffect(() => {
    console.log("collections data get by ids", collection)
  },[collection])

  return (
    <div className="collection">
      <h1>{handle}</h1>
      <p className="collection-description">{collection.description}</p>
      <PaginatedResourceSection<ProductItemFragment>
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({ node: product, index }) => (
          // <ProductItem
          //   key={product.id}
          //   product={product}
          //   loading={index < 8 ? 'eager' : undefined}
          // />
          <ProductCard
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
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
