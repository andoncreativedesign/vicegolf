// app/components/GolfBallProduct.tsx
import { useState, useEffect, useCallback } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { Youtube } from '~/components/Youtube';
import ProductDetailsContent1 from '~/components/Product/ProductDetailsContent1';
import { ProductGrid } from '~/components/ProductGrid';
import type { ProductDetails } from '~/lib/sanity/products';
import { RECOMMENDED_PRODUCTS_QUERY } from '~/lib/shopify/product-queries';
import { useFetcher } from 'react-router';

type GolfBallProductProps = {
  productDetails: ProductDetails | null;
  initialRecommended?: any; // from loader
  showBestSellers?: boolean;
};

export function GolfBallProduct({
  productDetails,
  initialRecommended,
  showBestSellers = true,
}: GolfBallProductProps) {
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

  // Handle fetcher updates (same pattern as homepage)
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
        {productDetails?.productContent1?.content?.map((item, index) => {
          const isEven = (index + 1) % 2 === 0;
          const isFirst = index === 0;
          const isSecond = index === 1;

          return (
            <div key={index} className={isFirst ? 'w-full' : ''}>
              <div className="w-full min-h-[50vh] flex items-center">
                <div className="w-full py-8 mb-0">
                  <ProductDetailsContent1
                    content={item}
                    showImageLeft={!isEven}
                    isTextFull={false}
                    isImageFull={false}
                    isFirst={isFirst}
                    isDescriptionFull={false}
                    imageSize={isFirst ? "large" : "large"}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {productDetails?.youtubeVideos && (
          <div className="mt-16 md:mt-20 lg:mt-24">
            <Youtube youtubeVideo={productDetails.youtubeVideos} />
          </div>
        )}

        {/* Best Sellers with Infinite Scroll */}
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