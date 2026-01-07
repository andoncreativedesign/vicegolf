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
        {productDetails?.productContent1?.content?.[0] && (
          <div className="w-full">
            <div className="flex items-center">
              <div className="w-full py-8 mb-0">
                <ProductDetailsContent1
                  content={productDetails.productContent1.content[0]}
                  showImageLeft={true}
                  isTextFull={false}
                  isImageFull={false}
                  isFirst={true}
                  isDescriptionFull={false}
                  isSquareAspect={true}
                  imageSize="large"
                />
              </div>
            </div>
          </div>
        )}

        {/* Second Product Content Section */}
        {productDetails?.productContent1?.content?.[1] && (
          <div className="w-full">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2 p-8">
                <div className="max-w-2xl mx-auto text-center lg:text-left">
                  <h3 className="lg:text-[48px] text-[32px] font-semibold w-full mt-6">
                    {productDetails.productContent1.content[1].title}
                  </h3>
                  {productDetails.productContent1.content[1].description && (
                    <p className="text-gray-600 !text-xl font-light leading-relaxed mt-1">
                      {productDetails.productContent1.content[1].description}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/2 h-96 lg:h-auto">
                <div className="w-full h-full flex items-center justify-center">
                  {productDetails.productContent1.content[1]?.images?.[0]?.asset?.url && (
                    <img
                      src={productDetails.productContent1.content[1].images[0].asset.url}
                      alt={productDetails.productContent1.content[1].title || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
