import { redirect, useLoaderData, Link, useNavigate, useSearchParams, useNavigation, useFetcher } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { SortFilter } from '~/components/SortFilter';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductCard } from '~/components/ProductCard';
import { VariantProductCard } from '~/components/Product/VariantProductCard';
import { type ShopifyCollection, type ShopifyCollectionResponse } from '~/lib/shopify/product-queries';
import { GET_PRODUCTS_BY_COLLECTION } from '~/lib/shopify/product-queries';
import { getListingByCollectionHandle, getAllListings } from '~/lib/sanity/products';
import { useEffect, useState } from 'react';
import { ImageList } from '~/components/ImageList';
import { VideoList } from '~/components/VideoList';
import { ChevronRight, X } from 'lucide-react';
import { loadFamilyData } from '~/utils/loadFamilyData';
import { HEADER_QUERY } from '~/lib/fragments';

export const meta: Route.MetaFunction = ({ data }: { data: any }) => {
    if (!data?.collection) {
        return [{ title: 'Vice Golf | Collection' }];
    }

    const { collection, url, handle } = data;
    const title = collection.seo?.title ?? `${collection.title || handle} Collection`;
    const description = collection.seo?.description ?? collection.description ?? '';

    const metaTags = [
        { title: `Vice Golf | ${title}` },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: url },
        {
            rel: 'canonical',
            href: url,
        },
    ];

    const ogTagImage = collection.og_tag_image?.reference?.image || (collection.og_tag_image?.reference?.url ? { id: collection.og_tag_image.reference.url, url: collection.og_tag_image.reference.url, altText: collection.og_tag_image.reference.altText } : null);
    const collectionImage = collection.image;
    const firstProduct = collection.products?.edges?.[0]?.node;
    const firstProductImage = firstProduct?.featuredImage || firstProduct?.images?.nodes?.[0];

    const imageObj = ogTagImage || collectionImage || firstProductImage;
    let finalImageUrl = imageObj?.url;

    if (finalImageUrl) {
        if (finalImageUrl.startsWith('//')) {
            finalImageUrl = `https:${finalImageUrl}`;
        }
        metaTags.push({ property: 'og:image', content: finalImageUrl });
        metaTags.push({ property: 'og:image:secure_url', content: finalImageUrl });

        if (imageObj?.width) {
            metaTags.push({ property: 'og:image:width', content: String(imageObj.width) });
        }
        if (imageObj?.height) {
            metaTags.push({ property: 'og:image:height', content: String(imageObj.height) });
        }
        if (imageObj?.altText) {
            metaTags.push({ property: 'og:image:alt', content: imageObj.altText });
        }

        metaTags.push({ property: 'twitter:card', content: 'summary_large_image' });
        metaTags.push({ property: 'twitter:image', content: finalImageUrl });

        if (imageObj?.altText) {
            metaTags.push({ property: 'twitter:image:alt', content: imageObj.altText });
        }
    }

    return metaTags;
};
export async function loader(args: Route.LoaderArgs) {
    const deferredData = loadDeferredData(args);
    const criticalData = await loadCriticalData(args);
    return { ...deferredData, ...criticalData, url: args.request.url };
}

async function loadCriticalData({ context, params, request }: Route.LoaderArgs) {
    const { handle } = params;
    const { storefront } = context;
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 8,
    });

    const searchParams = new URL(request.url).searchParams;
    const filters: any[] = [];
    for (const [key, value] of searchParams.entries()) {
        if (key.startsWith('filter.')) {
            try {
                filters.push(JSON.parse(value));
            } catch (e) {
                // Ignore invalid filter values
            }
        }
    }

    const sort = searchParams.get('sort');
    let sortKey: string = 'COLLECTION_DEFAULT';
    let reverse = false;

    switch (sort) {
        case 'price-low-high':
            sortKey = 'PRICE';
            reverse = false;
            break;
        case 'price-high-low':
            sortKey = 'PRICE';
            reverse = true;
            break;
        case 'newest':
            sortKey = 'CREATED';
            reverse = true;
            break;
        case 'featured':
            sortKey = 'MANUAL';
            reverse = false;
            break;
        default:
            sortKey = 'COLLECTION_DEFAULT';
    }

    if (!handle) {
        throw redirect('/collections');
    }

    const decodedHandle = decodeURIComponent(handle);

    // 1. Try to fetch as a direct collection first
    const collectionData = await storefront.query(`#graphql
        query GetCollectionId($handle: String!) {
            collection(handle: $handle) {
                id
                title
                handle
            }
        }
    `, {
        variables: { handle: decodedHandle }
    });

    let collectionIds: string[] = [];
    let displayTitle = '';
    let isVirtual = false;

    if (collectionData?.collection?.id) {
        collectionIds = [collectionData.collection.id];
        displayTitle = collectionData.collection.title;
    } else {
        // 2. If not found, check the main menu for a matching virtual handle
        const menuData = await storefront.query(HEADER_QUERY, {
            variables: { 
                headerMenuHandle: 'main-menu',
                language: storefront.i18n.language,
                country: storefront.i18n.country
            },
        });

        const matchedItem = menuData?.menu?.items?.find((item: any) => {
            const itemHandle = item.title.toLowerCase().replace(/\s+/g, '-');
            return itemHandle === decodedHandle;
        });

        if (matchedItem && matchedItem.items) {
            collectionIds = matchedItem.items
                .filter((inner: any) => inner.type === 'COLLECTION')
                .map((inner: any) => inner.resourceId)
                .filter(Boolean);
            
            displayTitle = matchedItem.title;
            isVirtual = true;
        }
    }

    if (collectionIds.length === 0) {
        throw new Response(`Collection ${decodedHandle} not found`, {
            status: 404,
        });
    }

    // Now fetch products using the collected IDs
    const [collectionResponse] = await Promise.all<any[]>([
        storefront.query(GET_PRODUCTS_BY_COLLECTION, {
            variables: {
                ids: collectionIds,
                ...paginationVariables,
                filters,
                sortKey,
                reverse
            },
        }),
    ]);

    if (!collectionResponse || !collectionResponse.nodes || collectionResponse.nodes.length === 0) {
        throw new Response(`Collection products for ${decodedHandle} not found`, {
            status: 404,
        });
    }

    // Filter out null nodes (deleted or draft collections) early
    const nonNullNodes = collectionResponse.nodes.filter((n: any) => n !== null);
    if (nonNullNodes.length === 0) {
        throw new Response(`Collection products for ${decodedHandle} not found`, {
            status: 404,
        });
    }

    // NEW: Extract the true collection handle from Shopify's response
    // This is the full, canonical handle (e.g., "junior-towels")—use it for Sanity lookup
    const trueCollectionHandle = collectionResponse.nodes[0]?.handle;

    // Robust function to combine products from multiple collections
    const combineCollectionProducts = (collections: any): ShopifyCollection | null => {
        try {
            if (!collections?.nodes?.length) {
                console.warn('No collection nodes returned from Shopify');
                return null;
            }

            // Filter collections that actually have products
            const validCollections = collections.nodes.filter(
                (c: any): c is NonNullable<typeof c> => Boolean(c?.products?.edges?.length)
            );

            if (validCollections.length === 0) {
                const firstNonNull = collections.nodes.find((n: any) => n !== null);
                if (!firstNonNull) return null;
                
                return {
                    ...firstNonNull,
                    products: {
                        ...firstNonNull.products,
                        edges: [],
                        pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null }
                    }
                };
            }

            // Multiple collections → merge products and filters
            const baseCollection = { ...validCollections[0]! };
            const allEdges = validCollections.flatMap((c: any) => c.products.edges);

            // Deduplicate products
            const uniqueProducts = new Map<string, any>();
            allEdges.forEach((edge: any) => {
                if (edge?.node?.id) {
                    uniqueProducts.set(edge.node.id, edge);
                }
            });

            // Merge and deduplicate filters
            const allFilters = validCollections.flatMap((c: any) => c.products.filters || []);
            const filterMap = new Map<string, any>();
            
            allFilters.forEach((filter: any) => {
                if (!filterMap.has(filter.id)) {
                    filterMap.set(filter.id, {
                        ...filter,
                        values: [...filter.values.map((v: any) => ({ ...v }))]
                    });
                } else {
                    const existingFilter = filterMap.get(filter.id);
                    filter.values.forEach((val: any) => {
                        const existingValue = existingFilter.values.find((v: any) => v.id === val.id);
                        if (existingValue) {
                            existingValue.count += val.count;
                        } else {
                            existingFilter.values.push({ ...val });
                        }
                    });
                }
            });

            const hasNextPage = validCollections.some((c: any) => c.products.pageInfo.hasNextPage);
            const hasPreviousPage = validCollections.some((c: any) => c.products.pageInfo.hasPreviousPage);
            const startCursor = validCollections.find((c: any) => c.products.pageInfo.startCursor)?.products.pageInfo.startCursor || null;
            const endCursor = validCollections.find((c: any) => c.products.pageInfo.endCursor)?.products.pageInfo.endCursor || null;

            return {
                ...baseCollection,
                products: {
                    ...baseCollection.products,
                    filters: Array.from(filterMap.values()),
                    edges: Array.from(uniqueProducts.values()),
                    pageInfo: {
                        hasNextPage,
                        hasPreviousPage,
                        startCursor,
                        endCursor
                    }
                }
            };
        } catch (error) {
            console.error('Error in combineCollectionProducts:', error);
            return collections.nodes[0] ? {
                ...collections.nodes[0],
                products: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } }
            } : null;
        }
    };

    const updatedCollection = combineCollectionProducts(collectionResponse);

    // Use trueCollectionHandle for Sanity query if available, otherwise fallback to URL handle
    const listingData = await getListingByCollectionHandle(trueCollectionHandle || decodedHandle.toLowerCase().replace(/\s+/g, '-'));

    // Family data loading logic
    const families = [
        ...new Set(
            updatedCollection?.products?.edges
                ?.map(edge => {
                    const product = edge.node as any;
                    const familyValue = product?.metafield?.value ||
                        product?.family?.value;
                    return familyValue;
                })
                .filter(Boolean) || []
        ),
    ];

    const familyGroups = await loadFamilyData(families as string[]);

    const updatedEdges = (updatedCollection?.products?.edges || []).map(edge => {
        const product = edge.node as any;
        const familyValue = product.metafield?.value || product.family?.value;
        const variantFamilyProducts = familyGroups[familyValue] || [];
        return {
            ...edge,
            node: {
                ...product,
                variantFamilyProducts
            }
        };
    });

    const finalCollection = {
        ...updatedCollection,
        title: displayTitle,
        handle: decodedHandle,
        products: {
            ...updatedCollection?.products,
            edges: updatedEdges
        }
    };

    return {
        collection: finalCollection,
        handle: displayTitle,
        listing: listingData
    };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
    return {};
}

/**
 * Sub-component for rendering the product grid or empty state
 */
function ProductGrid({ products, sessionDiscount }: { products: any, sessionDiscount?: any }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const navigation = useNavigation();
    const isPending = navigation.state !== 'idle' && navigation.location?.pathname === window.location.pathname;

    const clearFilters = () => {
        const newParams = new URLSearchParams(searchParams);
        Array.from(newParams.keys()).forEach(key => {
            if (key.startsWith('filter.')) newParams.delete(key);
        });
        newParams.delete('cursor');
        newParams.delete('direction');
        navigate(`${window.location.pathname}?${newParams.toString()}`, { replace: true, preventScrollReset: true });
    };

    if (products?.edges?.length > 0) {
        return (
            <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <PaginatedResourceSection
                    connection={products}
                    resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                >
                    {({ node, index }) => (
                        <VariantProductCard
                            key={node.id}
                            product={node}
                            loading={index < 8 ? 'eager' : undefined}
                            sessionDiscount={sessionDiscount}
                        />
                    )}
                </PaginatedResourceSection>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-50/50 rounded-3xl mt-8">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <X className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                Try adjusting your filters or search terms to find what you're looking for.
            </p>
            <button
                onClick={clearFilters}
                className="mt-6 text-sm font-black underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
                Clear all filters
            </button>
        </div>
    );
}

export default function Collection() {
    const { collection, handle, listing } = useLoaderData<typeof loader>();
    const [sessionDiscount, setSessionDiscount] = useState<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedData = localStorage.getItem('featuredDiscountData');
        if (storedData) {
            try {
                const parsedDiscount = JSON.parse(storedData);
                console.log('[Collection] Setting session discount from localStorage:', parsedDiscount);
                setSessionDiscount(parsedDiscount);
            } catch (e) {
                console.error('Error parsing stored discount data:', e);
            }
        }
    }, []);

    return (
        <div className="collection px-4 md:px-6 lg:px-8">
            {listing ? (
                <div className="listing-content mb-8">
                    {/* Visual Media Headers (Sanity) */}
                    <div className="bg-transparent overflow-hidden -mx-4 md:-mx-6 lg:-mx-8">
                        {listing.images && listing.images.length > 0 && (
                            <ImageList images={listing.images} className="w-full" />
                        )}
                        {listing.videos && listing.videos.length > 0 && (
                            <VideoList videos={listing.videos} className="w-full" />
                        )}
                    </div>

                    {/* SEO / Listing Header Text */}
                    <div className="mb-8 mt-8">
                        {listing.title && (
                            <h1 className="text-5xl font-black mb-2" style={{ fontSize: '3rem', fontWeight: '900' }}>
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

                    {/* Breadcrumbs */}
                    <nav className="breadcrumb-navigation mb-6 text-base">
                        <ol className="flex items-center space-x-2">
                            <li className='flex items-center'>
                                <span className="transition-colors cursor-pointer">Collection</span>
                                <ChevronRight className="text-gray-600" size={20} />
                            </li>
                            <li>
                                <span className="text-gray-900 font-semibold">{handle}</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Filters and Grid */}
                    <SortFilter 
                        filters={collection?.products?.filters || []}
                        hide={collection?.hide_filters?.value === 'true'}
                    >
                        <ProductGrid products={collection?.products} sessionDiscount={sessionDiscount} />
                    </SortFilter>
                </div>
            ) : (
                <div className="collection-standard py-8">
                    <h1 className="text-4xl font-extrabold mb-4">{collection?.title}</h1>
                    <p className="collection-description text-gray-600 mb-8">{collection?.description}</p>

                    {/* Breadcrumbs */}
                    <nav className="breadcrumb-navigation mb-6 text-base">
                        <ol className="flex items-center space-x-2">
                            <li className='flex items-center'>
                                <span className="transition-colors cursor-pointer">Collection</span>
                                <ChevronRight className="text-gray-600" size={20} />
                            </li>
                            <li>
                                <span className="text-gray-900 font-semibold">{collection?.title}</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Filters and Grid */}
                    <SortFilter 
                        filters={collection?.products?.filters || []}
                        hide={collection?.hide_filters?.value === 'true'}
                    >
                        <ProductGrid products={collection?.products} sessionDiscount={sessionDiscount} />
                    </SortFilter>
                </div>
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
