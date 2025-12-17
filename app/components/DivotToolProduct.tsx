import { useState, useEffect, useCallback } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';
import { useFetcher } from 'react-router';
import { ProductGrid } from '~/components/ProductGrid';

type DivotToolProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
    initialRecommended?: any;
    showBestSellers?: boolean;
};

export function DivotToolProduct({
    product,
    productDetails,
    initialRecommended,
    showBestSellers = false
}: DivotToolProductProps) {
    const fetcher = useFetcher();
    const [recommendedProducts, setRecommendedProducts] = useState<ProductFragment[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="max-w-8xl mx-auto">
                {/* Reusable What's New Section */}
                {productDetails?.productContent1?.content?.map((item, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;

                    return (
                        <div key={index} className={isFirst ? 'w-full' : ''}>
                            {isFirst ? (
                                // First section - Full width
                                <div className="w-full">
                                    <div className="flex items-center">
                                        <div className="w-full py-8 mb-0">
                                            <ProductDetailsContent1
                                                content={item}
                                                showImageLeft={true}  // Image will now appear above text
                                                isTextFull={true}
                                                isImageFull={true}
                                                isFirst={isFirst}
                                                isDescriptionFull={true}
                                                imageSize="xlarge"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Second section - Side by side
                                <div className="max-w-8xl mx-auto">
                                    <div className="min-h-[40vh]">
                                        <div className="h-full py-8">
                                            <ProductDetailsContent1
                                                content={item}
                                                showImageLeft={true}
                                                isTextFull={false}
                                                isImageFull={false}
                                                isDescriptionFull={false}
                                                isSquareAspect={isSecond}  // Apply square aspect ratio to second item
                                                imageSize="large"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {/* Youtube Video Section */}
                {productDetails && productDetails.youtubeVideos && (
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
