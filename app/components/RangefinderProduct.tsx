import { useState, useEffect, useCallback } from 'react';
import { useFetcher } from 'react-router';
import { ProductGrid } from '~/components/ProductGrid';
import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';
import { VideoSection } from './Product/VideoSection';
import { Youtube } from './Youtube';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';

type RangefinderProductProps = {
  productDetails: ProductDetails | null;
  initialRecommended?: any;
  showBestSellers?: boolean;
};

export function RangefinderProduct({
  productDetails,
  initialRecommended,
  showBestSellers = false
}: RangefinderProductProps) {
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
      <div className="max-w-8xl mx-auto">
        {productDetails?.videoContent && (
          <VideoSection videoContent={productDetails.videoContent} />
        )}

        {/* Product Content Sections */}
        {productDetails?.productContent1?.content?.map((item, index) => {
          const isFirst = index === 0;

          // Alternate between image left/text right (odd) and text left/image right (even)
          const showImageLeft = index % 2 === 0;

          return (
            <div key={index} className={isFirst ? 'w-full' : ''}>
              <div className="w-full">
                <div className="flex items-center">
                  <div className="w-full py-8 mb-0">
                    <ProductDetailsContent1
                      content={item}
                      showImageLeft={showImageLeft}
                      isTextFull={false}
                      isImageFull={false}
                      isFirst={isFirst}
                      isDescriptionFull={false}
                      isSquareAspect={isFirst}  // Apply square aspect ratio to first item
                      imageSize="large"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Youtube Video Section */}
        {productDetails?.youtubeVideos && (
          <div className="mt-16 md:mt-20 lg:mt-24">
            <Youtube youtubeVideo={productDetails.youtubeVideos} />
          </div>
        )}

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
