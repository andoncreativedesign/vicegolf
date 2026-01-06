import { useState, useEffect, useCallback } from 'react';
import { useFetcher } from 'react-router';
import { ProductGrid } from '~/components/ProductGrid';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type TeeProductProps = {
  product: ProductFragment;
  productDetails: ProductDetails | null;
  initialRecommended?: any;
  showBestSellers?: boolean;
};

export function TeeProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false
}: TeeProductProps) {
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
        {/* Reusable What's New Section */}
        {productDetails?.productContent1?.content?.map((item, index) => {
          const isFirst = index === 0;

          return (
            <div
              key={index}
              className={`${isFirst ? 'w-full' : ''}`}
            >
              {isFirst ? (
                <div className="w-full">
                  <div className="flex flex-col space-y-8 py-8">
                    <ProductDetailsContent1
                      content={item}
                      showImageLeft={true}
                      isTextFull={true}
                      isImageFull={true}
                      isDescriptionFull={true}
                      imageSize="xlarge"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex flex-col space-y-8 py-8">
                    <ProductDetailsContent1
                      content={item}
                      showImageLeft={true}
                      isTextFull={true}
                      isImageFull={true}
                      isDescriptionFull={true}
                      imageSize="xlarge"
                    />
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
