// app/components/GolfBallProduct.tsx
import { useState, useEffect, useCallback } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { ProductDetailContents } from '~/components/Product/ProductDetailContents';
import { Youtube } from '~/components/Youtube';
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
    <>
      {productDetails && (
        <ProductDetailContents
          content={productDetails?.productContent1?.content || []}
          content2={productDetails?.productContent2?.sections?.[0]}
          imageSize="xlarge"
        />
      )}

      {productDetails?.youtubeVideos && (
        <Youtube youtubeVideo={productDetails.youtubeVideos} />
      )}

      {/* Best Sellers with Infinite Scroll */}
      {showBestSellers && recommendedProducts.length > 0 && (
        <div className="mt-16 max-w-7xl mx-auto px-4">
          <ProductGrid
            products={recommendedProducts}
            title="OUR BEST SELLERS"
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={isLoading}
          />
        </div>
      )}
    </>
  );
}