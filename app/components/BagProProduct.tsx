import { useState, useEffect, useCallback } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import ProductDetailsContent2 from './Product/ProductDetailsContent2';
import { Youtube } from './Youtube';
import { VideoSection } from './Product/VideoSection';
import { useFetcher } from 'react-router';
import { ProductGrid } from '~/components/ProductGrid';

type BagProProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
    initialRecommended?: any;
    showBestSellers?: boolean;
};

export function BagProProduct({ product, productDetails, initialRecommended, showBestSellers = false }: BagProProductProps) {
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
                {/* Video Section - Show first if video content exists */}
                {productDetailsState?.videoContent && (
                    <VideoSection videoContent={productDetailsState.videoContent} />
                )}

                {/* Dynamic Content Sections – First section: Image Left, Text Right; Then alternate */}
                {productDetailsState?.productContent1?.content?.map((item, index) => {
                    // First section: Image Left, Text Right (showImageLeft=true)
                    // Then alternate for subsequent sections
                    const shouldShowImageLeft = index % 2 === 0; // true for even indices (0, 2, 4...)
                    const isFirst = index === 0;

                    return (
                        <div key={index} className={isFirst ? "w-full py-8" : "py-12"}>
                            <ProductDetailsContent1
                                content={item}
                                showImageLeft={shouldShowImageLeft}
                                isTextFull={index === 2}
                                isImageFull={false}
                                isFirst={isFirst}
                                isThird={index === 2}
                                isDescriptionFull={index === 2}
                                isSquareAspect={true}
                                imageSize="xlarge"
                            />
                        </div>
                    );
                })}

                {/* Product Content 2 Section */}
                {productDetailsState?.productContent2?.sections?.map((section, index) => (
                    <div key={index} className="mt-16 md:mt-20 lg:mt-24">
                        <ProductDetailsContent2
                            content={section}
                            index={index}
                        />
                    </div>
                ))}

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