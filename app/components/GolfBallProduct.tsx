import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { ProductDetailContents } from '~/components/Product/ProductDetailContents';
import { Youtube } from '~/components/Youtube';
import type { ProductDetails } from '~/lib/sanity/products';

type GolfBallProductProps = {
  productDetails: ProductDetails | null;
};

export function GolfBallProduct({ productDetails }: GolfBallProductProps) {

  return (
    <>
      {/* Reusable What's New Section */}
      {productDetails && 
        <ProductDetailContents
          content={productDetails?.productContent1?.content || []}
          content2={productDetails?.productContent2?.sections?.[0]}
        />
      }
      {/* Youtube Video Section */}
      {productDetails && productDetails?.youtubeVideos &&
      <Youtube youtubeVideo={productDetails?.youtubeVideos}/>
      }
    </>
  );
}
