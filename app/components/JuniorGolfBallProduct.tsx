import { useState, useEffect, useCallback } from 'react';
import { useFetcher } from 'react-router';
import { ProductGrid } from '~/components/ProductGrid';
import type { ProductFragment } from 'storefrontapi.generated';
import ProductDetailsContent1 from '~/components/Product/ProductDetailsContent1';
import ProductAccordion2 from '~/components/Product/ProductAccordion2';
import type { ProductDetails } from '~/lib/sanity/products';

type JuniorGolfBallProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
    initialRecommended?: any;
    showBestSellers?: boolean;
};

export function JuniorGolfBallProduct({
    product,
    productDetails,
    initialRecommended,
    showBestSellers = false
}: JuniorGolfBallProductProps) {
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
        <div>
            <div className="w-full max-w-[1340px] mx-auto">
                {productDetails?.productContent1?.content?.slice(0, 3).map((item, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;
                    const isThird = index === 2;

                    // Text top, Image bottom full width for index 0 and 1. Side-by-side for index 2.
                    const isSideBySide = index === 2;

                    return (
                        <div key={index} className="w-full pb-10">
                            <ProductDetailsContent1
                                content={item}
                                showImageLeft={false} // Text first (Top) or Left
                                isTextFull={!isSideBySide}     // Full width Text unless side-by-side
                                isImageFull={!isSideBySide}    // Full width Image unless side-by-side
                                isFirst={isFirst}
                                isSecond={isSecond}
                                isThird={isThird}
                                isDescriptionFull={!isSideBySide}
                                imageSize={isSideBySide ? "xlarge" : "xlarge"}
                                titleClassName={isSideBySide ? "text-4xl lg:text-5xl font-bold text-left w-full" : "text-4xl lg:text-5xl font-bold text-center"}
                                descriptionClassName={isSideBySide ? "!text-xl font-light text-gray-600 w-full text-left mt-2" : "!text-xl font-light text-gray-600 w-full max-w-full px-4 text-center"}
                                imageContainerClassName={`px-4 md:px-8 lg:px-12 ${isSideBySide ? 'flex items-center' : ''} ${isSideBySide ? 'lg:flex-1' : ''}`}
                                imageClassName={isSideBySide ? "w-auto max-w-full h-auto max-h-[70vh] lg:max-h-[80vh] object-contain mx-auto" : "w-full h-auto max-h-[60vh] object-cover"}
                                imageCentered={isSideBySide}
                                titleContainerClassName={isSideBySide ? "items-center" : ""}
                                imageObjectFit={isSideBySide ? 'contain' : 'cover'}
                            />
                            {index === 2 && (
                                <ProductAccordion2 accordion2={productDetails?.accordion2} />
                            )}
                        </div>
                    );
                })}

                {/* Best Sellers Section */}
                {showBestSellers && recommendedProducts.length > 0 && (
                    <div className="mt-16 px-4 sm:px-6 lg:px-8">
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
