// app/components/GolfBallProduct.tsx
import { useState, useEffect, useCallback } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { Youtube } from '~/components/Youtube';
import ProductDetailsContent1 from '~/components/Product/ProductDetailsContent1';
import ProductDetailsContent2 from '~/components/Product/ProductDetailsContent2';
import { ProductGrid } from '~/components/ProductGrid';
import ProductAccordion2 from '~/components/Product/ProductAccordion2';
import type { ProductDetails } from '~/lib/sanity/products';
import { RECOMMENDED_PRODUCTS_QUERY } from '~/lib/shopify/product-queries';
import { useFetcher } from 'react-router';

type GolfBallProductProps = {
  productDetails: ProductDetails | null;
  initialRecommended?: any; // from loader
  showBestSellers?: boolean;
  isGolfBallProduct?: boolean;
};

export function GolfBallProduct({
  productDetails,
  initialRecommended,
  showBestSellers = true,
  isGolfBallProduct = false,
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
    <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 ${isGolfBallProduct ? '' : 'py-8'}`}>
      <div className="w-full max-w-[1536px] mx-auto">
        {productDetails?.productContent1?.content?.map((item, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;

          // For golf ball products, show image on the left for the first section, right for the second
          // For non-golf ball products, alternate the layout
          const showImageLeft = isGolfBallProduct ? isFirst : (index % 2 === 0);

          return (
            <div key={index} className={isFirst ? 'w-full' : ''}>
              <div className={`w-full min-h-[30vh] flex items-center ${isFirst ? 'py-4 md:py-8' : 'py-8 md:py-16'}`}>
                <div className={`w-full ${isFirst ? 'max-w-full' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
                  <ProductDetailsContent1
                    content={item}
                    showImageLeft={showImageLeft}
                    isTextFull={isFirst}
                    isImageFull={isFirst}
                    isFirst={isFirst}
                    isSecond={isSecond}
                    isThird={isThird}
                    isDescriptionFull={isFirst}
                    imageSize={isFirst ? "xlarge" : "large"}
                    titleClassName={`${isGolfBallProduct ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl'} font-bold text-center sm:text-left`}
                    descriptionClassName={`${!isGolfBallProduct ? '!text-base sm:!text-lg lg:!text-xl' : 'text-sm sm:text-base'} font-light text-gray-600 w-full max-w-4xl mx-auto text-center sm:text-left`}
                    pointsClassName="w-full max-w-4xl mx-auto"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Product Content 2 Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {productDetails?.productContent2?.sections?.map((section, index) => (
            <div key={index} className="w-full">
              <ProductDetailsContent2 content={section} index={index} />
            </div>
          ))}
        </div>

        {productDetails?.accordion2 && (
          <div className="my-20">
            <ProductAccordion2 accordion2={productDetails.accordion2} />
          </div>
        )}

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