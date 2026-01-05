import { useState, useEffect, useCallback } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import { Youtube } from './Youtube';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { VideoSection } from './Product/VideoSection';
import { ProductGrid } from './ProductGrid';
import { useFetcher } from 'react-router';


type GolfClubSetProductProps = {
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

export function GolfClubSetProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false
}: GolfClubSetProductProps) {
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
    <div className='w-full max-w-[1536px] mx-auto'>
      {productDetails && productDetails?.youtubeVideos &&
        <Youtube youtubeVideo={productDetails?.youtubeVideos} />
      }

      <div className='px-8 py-4'>
        {productDetails && productDetails?.videoContent &&
          <VideoSection
            titleSize='lg:text-[48px] text-[32px] font-semibold'
            videoContent={productDetails?.videoContent}
          />
        }

        {/* Reusable What's New Section */}
        {productDetails?.productContent1?.content &&
          productDetails?.productContent1?.content.map((item, index) => (
            <ProductDetailsContent1
              key={index}
              content={item}
              showImageLeft={index % 2 === 0}
              titleClassName='lg:text-[48px] text-[32px] font-semibold w-full'
              imageSize='xlarge'
            />
          ))
        }
      </div>

      {showBestSellers &&
        recommendedProducts.length > 0 && (
          <div className="mt-16 md:mt-20 lg:mt-24 px-8">
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
