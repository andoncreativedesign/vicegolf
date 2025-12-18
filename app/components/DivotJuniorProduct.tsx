import { useState, useEffect, useCallback } from 'react';
import { useFetcher } from 'react-router';
import { ProductGrid } from '~/components/ProductGrid';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type DivotJuniorProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
    initialRecommended?: any;
    showBestSellers?: boolean;
};

export function DivotJuniorProduct({
    product,
    productDetails,
    initialRecommended,
    showBestSellers = false
}: DivotJuniorProductProps) {
    const fetcher = useFetcher();
    const [recommendedProducts, setRecommendedProducts] = useState<ProductFragment[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productDetailsState, setProductDetails] = useState<ProductDetails | null>(productDetails);

    // Initialize from loader data
    useEffect(() => {
        if (initialRecommended?.products?.nodes) {
            setRecommendedProducts(initialRecommended.products.nodes);
            setCursor(initialRecommended.products.pageInfo.endCursor || null);
            setHasMore(!!initialRecommended.products.pageInfo.hasNextPage);
        }
    }, [initialRecommended]);

    // Handle fetcher updates
    useEffect(() => {
        if (fetcher.state === 'idle' && fetcher.data) {
            const data = fetcher.data;
            if (data.recommendedProducts?.products?.nodes?.length > 0) {
                setRecommendedProducts(prev => [...prev, ...data.recommendedProducts.products.nodes]);
                setCursor(data.recommendedProducts.products.pageInfo.endCursor || null);
                setHasMore(!!data.recommendedProducts.products.pageInfo.hasNextPage);
                setIsLoading(false);
            }
        }
    }, [fetcher.state, fetcher.data]);

    const handleLoadMore = useCallback(() => {
        if (!cursor || isLoading || !hasMore) return;
        setIsLoading(true);
        fetcher.submit(
            { recommendedCursor: cursor },
            { method: 'get', action: '.' }
        );
    }, [cursor, hasMore, isLoading, fetcher]);

    // Fetch product details if not provided
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productDetails) {
                const details = await getProductDetails(product.id);
                setProductDetails(details);
            }
        };
        fetchProductDetails();
    }, [product.id, productDetails]);

    return (
        <div>
            <div className="max-w-8xl mx-auto">
                {/* Dynamic Content Sections – Alternating: Text first → Image first → Text first... */}
                {productDetailsState?.productContent1?.content?.map((item, index) => {
                    const isEvenIndex = index % 2 === 0; // 0, 2, 4 → Text Left
                    const isFirst = index === 0;

                    // For the very first section, force full-width treatment
                    if (isFirst) {
                        return (
                            <div key={index} className="w-full py-8">
                                <ProductDetailsContent1
                                    content={item}
                                    showImageLeft={true}        // Image Left → Text Right
                                    isTextFull={false}
                                    isImageFull={false}
                                    isFirst={true}
                                    isDescriptionFull={false}
                                    isSquareAspect={true}       // Apply square aspect ratio
                                    imageSize="xlarge"
                                />
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="py-12">
                            <ProductDetailsContent1
                                content={item}
                                showImageLeft={isEvenIndex}   // Even index (0,2,4) → Image Left (Text Right) → showImageLeft = true
                                // Odd index (1,3,5) → Text Left (Image Right) → showImageLeft = false
                                isTextFull={false}
                                isImageFull={false}
                                isFirst={false}
                                isDescriptionFull={false}
                                isSquareAspect={true}          // Apply square aspect ratio
                                imageSize="xlarge"
                            />
                        </div>
                    );
                })}

                {/* YouTube Section */}
                {productDetails?.youtubeVideos && (
                    <div className="mt-16 md:mt-20 lg:mt-24">
                        <Youtube youtubeVideo={productDetails.youtubeVideos} />
                    </div>
                )}

                {/* Best Sellers Section */}
                {showBestSellers && recommendedProducts.length > 0 && (
                    <div className="mt-16">
                        <ProductGrid
                            products={recommendedProducts}
                            title="OUR BEST SELLERS"
                            onLoadMore={handleLoadMore}
                            hasMore={hasMore}
                            loading={isLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
