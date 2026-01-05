import { useState, useEffect, useCallback } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import ProductDetailsContent2 from './Product/ProductDetailsContent2';
import { Youtube } from './Youtube';
import { VideoSection } from './Product/VideoSection';
import { ProductGrid } from './ProductGrid';
import { useFetcher } from 'react-router';


type PuttersProductProps = {
  product: {
    id: string;
    productType?: string;
    tags?: string[];
    [key: string]: any;
  };
  productDetails: ProductDetails | null;
  initialRecommended?: any;
  showBestSellers?: boolean;
};

export function PuttersProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false
}: PuttersProductProps) {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
      {/* YouTube Section */}
      {productDetails?.youtubeVideos && <Youtube youtubeVideo={productDetails.youtubeVideos} />}

      {/* Video Section */}
      {productDetails?.videoContent && (
        <VideoSection
          videoContent={productDetails.videoContent}
          titleSize="text-4xl lg:text-5xl"
          descriptionSize="!text-xl font-light"
        />
      )}

      <div className="container mx-auto  max-w-7xl w-full">
        {productDetails?.productContent1?.content?.slice(0, 1).map((item, index) => (
          <div key={index} className="w-full">
            <div className="flex flex-col space-y-8 py-8">
              <ProductDetailsContent1
                content={item}
                showImageLeft={false}
                isTextFull={true}
                isImageFull={true}
                isDescriptionFull={true}
                imageSize="xlarge"
                titleClassName="text-4xl lg:text-5xl font-bold"
              />
            </div>
          </div>
        ))}

        {/* Product Content 2 */}
        {productDetails?.productContent2?.sections?.map((section, index: number) => (
          <div key={index} className="w-full">
            <ProductDetailsContent2 content={section} index={index} />
          </div>
        ))}
      </div>

      {showBestSellers &&
        recommendedProducts.length > 0 && (
          <div className="mt-16 md:mt-20 lg:mt-24">
            <ProductGrid
              products={recommendedProducts}
              title="EXPLORE OUR GOLF CLUBS"
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={isLoading}
            />
          </div>
        )}
    </div>
  );
}