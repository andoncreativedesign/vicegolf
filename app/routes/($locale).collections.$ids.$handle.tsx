import { redirect, useLoaderData, Link } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductItem } from '~/components/ProductItem';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { ProductCard } from '~/components/ProductCard';
import { VariantProductCard } from '~/components/Product/VariantProductCard';
import { createCategoryQuery, type ShopifyCollection, type ShopifyCollectionResponse } from '~/lib/shopify/product-queries';
import { GET_PRODUCTS_BY_COLLECTION } from '~/lib/shopify/product-queries';
import { getListingByCollectionHandle, getAllListings } from '~/lib/sanity/products';
import { isValidElement, useEffect } from 'react';
import { ImageList } from '~/components/ImageList';
import { VideoList } from '~/components/VideoList';
import { axiosShopifyAdmin } from '~/utils/axiosInsatances';
import { ADMIN_PRODUCTS_BY_FAMILY_FOR_CARD } from '~/lib/shopify/product-queries';
import { ChevronRight } from 'lucide-react';

export const meta: Route.MetaFunction = ({ data }) => {
    return [{ title: `Vice Golf | ${data?.collection?.title ?? ''} Collection` }];
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

// ! working code
/* 
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
    const decodedHandle = decodeURIComponent(handle); // Keep for UI/display (e.g., breadcrumbs)

    console.log('🔍 Debug: URL handle:', handle);
    console.log('🔍 Debug: Decoded handle:', decodedHandle);

    // OLD: Convert space-separated handle to Shopify format (golf-balls)
    // const shopifyHandle = decodedHandle.toLowerCase().replace(/\s+/g, '-');
    // NEW: We'll derive the true shopifyHandle from the collection response below

    // Debug: Check all listings in Sanity
    await getAllListings();

    const [collection] = await Promise.all<ShopifyCollectionResponse>([
        storefront.query(GET_PRODUCTS_BY_COLLECTION, {
            variables: {
                ids: decodedIds,
                ...paginationVariables
            },
        }),
    ]);

    console.log('\n\ngolf collection ');
    console.log(JSON.stringify(collection?.nodes[0]?.products?.edges));

    if (!collection || !collection.nodes?.length) {
        throw new Response(`Collection ${decodedHandle} not found`, {
            status: 404,
        });
    }

    // NEW: Extract the true collection handle from Shopify's response
    // This is the full, canonical handle (e.g., "junior-towels")—use it for Sanity lookup
    const trueCollectionHandle = collection.nodes[0]?.handle; // Assumes first node is primary; adjust if multi-node logic changes
    console.log('🔍 Debug: True collection handle from Shopify:', trueCollectionHandle);

    if (!trueCollectionHandle) {
        console.warn('⚠️ No collection handle found in response—falling back to URL-derived');
        // Fallback to old logic if somehow missing (rare)
        const fallbackHandle = decodedHandle.toLowerCase().replace(/\s+/g, '-');
        // But proceed—Sanity query may still fail gracefully
    }

    // ... (your existing combineCollectionProducts function remains unchanged)
    const combineCollectionProducts = (collections: ShopifyCollectionResponse): ShopifyCollection | null => {
        try {
            if (!collections?.nodes?.length) {
                console.warn('No collection nodes returned from Shopify');
                return null;
            }

            // Filter collections that actually have products
            const validCollections = collections.nodes.filter(
                (c): c is NonNullable<typeof c> => Boolean(c?.products?.edges?.length)
            );

            if (validCollections.length === 0) {
                console.warn('No collections with products found');
                // Instead of returning null, return the first node with empty products
                return {
                    ...collections.nodes[0]!,
                    products: {
                        edges: [],
                        pageInfo: { hasNextPage: false, hasPreviousPage: false }
                    }
                };
            }

            // If only one collection → return it directly
            if (validCollections.length === 1) {
                return validCollections[0]!;
            }

            // Multiple collections → merge products (your original logic)
            const baseCollection = { ...validCollections[0]! };

            const allEdges = validCollections.flatMap(c => c.products.edges);

            const uniqueProducts = new Map<string, any>();
            allEdges.forEach(edge => {
                if (edge?.node?.id) {
                    uniqueProducts.set(edge.node.id, edge);
                }
            });

            return {
                ...baseCollection,
                products: {
                    ...baseCollection.products,
                    edges: Array.from(uniqueProducts.values()),
                    pageInfo: {
                        hasNextPage: false,
                        hasPreviousPage: false,
                        startCursor: null,
                        endCursor: null
                    }
                }
            };
        } catch (error) {
            console.error('Error in combineCollectionProducts:', error);
            // Fallback: return first collection even if empty
            return collections.nodes[0] ? {
                ...collections.nodes[0],
                products: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } }
            } : null;
        }
    };

    const updatedCollection = combineCollectionProducts(collection);

    // NEW: Use trueCollectionHandle for Sanity query
    const listingData = await getListingByCollectionHandle(trueCollectionHandle || decodedHandle.toLowerCase().replace(/\s+/g, '-'));

    console.log("\n\nupdatedCollection data 213123");
    console.log(JSON.stringify(updatedCollection?.products?.edges?.[0]));

    // ... (your existing family extraction, queries, and attachment logic remains unchanged)
    const families = [
        ...new Set(
            updatedCollection?.products?.edges
                ?.map(edge => {
                    const familyValue = edge?.node?.metafield?.value ||
                        edge?.node?.family?.value;
                    return familyValue;
                })
                .filter(Boolean) || []
        ),
    ];

    const familyQueries = families.map(fam => ({
        value: fam,
        query: `metafields.custom.family:"${fam}"`,
    }));

    const familyGroups: Record<string, any[]> = {};

    for (const fam of familyQueries) {
        const response = await axiosShopifyAdmin.post("", {
            query: ADMIN_PRODUCTS_BY_FAMILY_FOR_CARD,
            variables: {
                searchQuery: `metafields.custom.family:"${fam.value}"`,
            },
        });

        if (response.data.errors) {
            throw new Error(JSON.stringify(response?.data?.errors));
        }

        const colorVariantsRes = response.data?.data?.products?.edges || [];

        const products = colorVariantsRes.map(({ node }) => ({
            ...node,
            id: node.id,
            title: node.title,
            productType: node.productType,
            tags: node?.tags,
            vendor: node?.vendor,
            handle: node?.handle,
            featuredImage: node?.featuredImage ? {
                id: node.featuredImage.id,
                url: node.featuredImage.url,
                altText: node.featuredImage.altText,
                width: node.featuredImage.width,
                height: node.featuredImage.height
            } : null,
            variantImage: node?.variantImage?.reference?.image ? {
                id: node.variantImage.reference.id,
                url: node.variantImage.reference.image.url,
                altText: node.variantImage.reference.image.altText,
                width: node.variantImage.reference.image.width,
                height: node.variantImage.reference.image.height
            } : null,
            availableForSale: (node?.availableForSale || 0) > 0,
            family: node?.family ? {
                id: node.family.id,
                namespace: node.family.namespace,
                key: node.family.key,
                type: node.family.type,
                value: node.family.value
            } : null
        }));

        familyGroups[fam.value] = products;
    }

    function attachFamilyGroups(products) {
        const updatedProduct = products?.map(p => ({
            ...p,
            tags: p?.tags || [],
            variantFamilyProducts: familyGroups[p?.family?.value] || [],
        }));
        return updatedProduct;
    }

    const updateNodes = (edge: any) => {
        const product = edge.node;
        const variantFamilyProducts = familyGroups[product.metafield?.value || product.family?.value] || [];
        return {
            ...edge,
            node: {
                ...product,
                variantFamilyProducts
            }
        };
    };

    const updatedEdges = updatedCollection?.products?.edges?.map(updateNodes) || [];
    const updatedCollectionWithVariants = {
        ...updatedCollection,
        products: {
            ...updatedCollection?.products,
            edges: updatedEdges
        }
    };

    console.log('\n\n updatedCollection');
    console.log(updatedCollection?.products.edges[0].node);
    console.log('\n\nproductsWithColorVariants');
    console.log(updatedCollectionWithVariants.products.edges[0].node);

    return {
        collection: updatedCollectionWithVariants,
        handle: decodedHandle, // Still use URL handle for UI
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
        <div className="collection px-4 md:px-6 lg:px-8">
            {/* Display Sanity listing content if available */}
            {listing && (
                <div className="listing-content mb-8">
                    {/* Image and video section */}
                    <div className="bg-transparent overflow-hidden -mx-4 md:-mx-6 lg:-mx-8">
                        {/* Display listing images */}
                        {listing.images && listing.images.length > 0 && (
                            <ImageList
                                images={listing.images}
                                className="w-full"
                            />
                        )}

                        {/* Display listing videos */}
                        {listing.videos && listing.videos.length > 0 && (
                            <VideoList
                                videos={listing.videos}
                                className="w-full"
                            />
                        )}
                    </div>

                    <div className="mb-8">
                        {listing.title && (
                            <h1
                                className="text-5xl font-black mb-2"
                                style={{ fontSize: '3rem', fontWeight: '900' }}
                            >
                                {listing.title}
                            </h1>
                        )}

                        {listing.subtitle && (
                            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                                {listing.subtitle}
                            </h2>
                        )}

                        {listing.description && (
                            <p className="text-base text-gray-700 leading-relaxed mb-6">
                                {listing.description}
                            </p>
                        )}
                    </div>

                    {/* Breadcrumb navigation */}
                    <nav className="breadcrumb-navigation mt-8 mb-6 text-base">
                        <ol className="flex items-center space-x-2">
                            <li className='flex items-center'>
                                <span className="transition-colors cursor-pointer">
                                    Collection
                                </span>
                                <ChevronRight className="text-gray-600" size={20} />
                            </li>
                            <li>
                                <span className="text-gray-900 font-semibold">
                                    {handle}
                                </span>
                            </li>
                        </ol>
                    </nav>

                    {/* Product Grid */}
                    {collection?.products?.edges?.length > 0 && (
                        <PaginatedResourceSection
                            connection={collection?.products}
                            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                        >
                            {({ node, index }) => (
                                <VariantProductCard
                                    key={node.id}
                                    product={node}
                                    loading={index < 8 ? 'eager' : undefined}
                                />
                            )}
                        </PaginatedResourceSection>
                    )}


                    {/* Fallback to original collection header if no listing data */}
                </div>
            )}

            {!listing && (
                <>
                    <h1>{handle}</h1>
                    <p className="collection-description">{collection?.description}</p>

                    {/* Breadcrumb navigation */}
                    <nav className="breadcrumb-navigation mt-8 mb-6 text-base">
                        <ol className="flex items-center space-x-2">
                            <li className='flex items-center'>
                                <span className="transition-colors cursor-pointer">
                                    Collection
                                </span>
                                <ChevronRight className="text-gray-600" size={20} />
                            </li>
                            <li>
                                <span className="text-gray-900 font-semibold">
                                    {handle}
                                </span>
                            </li>
                        </ol>
                    </nav>

                    {/* Product Grid */}
                    {collection?.products?.edges?.length > 0 && (
                        <PaginatedResourceSection
                            connection={collection?.products}
                            resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                        >
                            {({ node, index }) => (
                                <VariantProductCard
                                    key={node.id}
                                    product={node}
                                    loading={index < 8 ? 'eager' : undefined}
                                />
                            )}
                        </PaginatedResourceSection>
                    )}
                </>
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


