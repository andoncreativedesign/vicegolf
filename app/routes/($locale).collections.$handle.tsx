import { redirect, useLoaderData, Link } from 'react-router';
import type { Route } from './+types/collections.$handle';
import { getPaginationVariables, Analytics } from '@shopify/hydrogen';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductCard } from '~/components/ProductCard';
import { VariantProductCard } from '~/components/Product/VariantProductCard';
import { type ShopifyCollection, type ShopifyCollectionResponse } from '~/lib/shopify/product-queries';
import { GET_PRODUCTS_BY_COLLECTION } from '~/lib/shopify/product-queries';
import { getListingByCollectionHandle, getAllListings } from '~/lib/sanity/products';
import { useEffect } from 'react';
import { ImageList } from '~/components/ImageList';
import { VideoList } from '~/components/VideoList';
import { ChevronRight } from 'lucide-react';
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
                ...paginationVariables
            },
        }),
    ]);

    if (!collectionResponse || !collectionResponse.nodes?.length) {
        throw new Response(`Collection products for ${decodedHandle} not found`, {
            status: 404,
        });
    }

    // For multiple collections, we might have multiple nodes. We'll merge them or take the first one 
    // as the base for metadata, but the product list will be complete if our query supports multiple IDs.
    // GET_PRODUCTS_BY_COLLECTION usually takes an array of IDs and returns an array of collections.
    
    // Merge products from all collections in the response
    const allProducts: any[] = [];
    collectionResponse.nodes.forEach((col: any) => {
        if (col.products?.edges) {
            allProducts.push(...col.products.edges);
        }
    });

    const baseCollection = collectionResponse.nodes[0];

    // Sanity listing search - use the handle we navigated with
    const listingData = await getListingByCollectionHandle(decodedHandle);

    // Family data loading logic
    const families = [
        ...new Set(
            allProducts
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

    const updatedEdges = allProducts.map(edge => {
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

    const updatedCollection = {
        ...baseCollection,
        title: displayTitle,
        handle: decodedHandle,
        products: {
            ...baseCollection.products,
            edges: updatedEdges
        }
    };

    return {
        collection: updatedCollection,
        handle: displayTitle,
        listing: listingData
    };
}

function loadDeferredData({ context }: Route.LoaderArgs) {
    return {};
}

export default function Collection() {
    const { collection, handle, listing } = useLoaderData<typeof loader>();

    const hasProducts = Boolean(
        collection?.products?.edges?.some((edge) => edge?.node)
    );

    return (
        <div className="collection px-4 md:px-6 lg:px-8">
            {listing && (
                <div className="listing-content mb-8">
                    <div className="bg-transparent overflow-hidden -mx-4 md:-mx-6 lg:-mx-8">
                        {listing.images && listing.images.length > 0 && (
                            <ImageList images={listing.images} className="w-full" />
                        )}
                        {listing.videos && listing.videos.length > 0 && (
                            <VideoList videos={listing.videos} className="w-full" />
                        )}
                    </div>

                    <div className="mb-8">
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

                    <nav className="breadcrumb-navigation mt-8 mb-6 text-base">
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
                </div>
            )}

            {!listing && (
                <>
                    <h1 className="text-4xl font-extrabold mb-4">{collection?.title}</h1>
                    <p className="collection-description">{collection?.description}</p>

                    <nav className="breadcrumb-navigation mt-8 mb-6 text-base">
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
