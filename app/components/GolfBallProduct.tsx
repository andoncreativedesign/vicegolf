// app/components/GolfBallProduct.tsx
import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { ProductDetailContents } from '~/components/Product/ProductDetailContents';
import { Youtube } from '~/components/Youtube';
import { BestSellers } from '~/components/BestSellers';
import type { ProductDetails } from '~/lib/sanity/products';

type GolfBallProductProps = {
  productDetails: ProductDetails | null;
  recommendedProducts?: any;
  /**
   * Controls whether to show the BestSellers section
   * @default true
   */
  showBestSellers?: boolean;
};

export function GolfBallProduct({
  productDetails,
  recommendedProducts,
  showBestSellers = true
}: GolfBallProductProps) {
  return (
    <>
      {/* Reusable What's New Section */}
      {productDetails &&
        <ProductDetailContents
          content={productDetails?.productContent1?.content || []}
          content2={productDetails?.productContent2?.sections?.[0]}
          imageSize="xlarge"
        />
      }
      {/* Youtube Video Section */}
      {productDetails && productDetails?.youtubeVideos &&
        <Youtube youtubeVideo={productDetails?.youtubeVideos} />
      }
      {/* Best Sellers Section - Conditionally rendered */}
      {showBestSellers && recommendedProducts && recommendedProducts.products?.nodes?.length > 0 && (
        <div className="mt-16">
          <BestSellers products={recommendedProducts.products.nodes} title={null} />
        </div>
      )}
    </>
  );
}