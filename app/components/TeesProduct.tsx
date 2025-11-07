import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';


type PoloProductProps = {
  productDetails: ProductDetails | null;
};

export function TeeProduct({ productDetails }: PoloProductProps) {

  return (
    <>
      {/* Reusable What's New Section */}
      {productDetails?.productContent1?.content?.map((item, index) => {
        const isEven = (index + 1) % 2 === 0;
        return (
          <ProductDetailsContent1
            key={index}
            content={item}
            // showImageLeft={!true}
            isTextFull={true}
            isImageFull={true}
          />
        );
      })}

      {/* Youtube Video Section */}
      {productDetails && productDetails.youtubeVideos &&
        <Youtube youtubeVideo={productDetails.youtubeVideos} />
      }
    </>
  );
}
