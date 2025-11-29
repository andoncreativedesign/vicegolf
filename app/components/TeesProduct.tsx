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
    <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
      <div className="max-w-8xl mx-auto">
        {/* Reusable What's New Section */}
        {productDetails?.productContent1?.content?.map((item, index) => {
          const isEven = (index + 1) % 2 === 0;
          const isFirst = index === 0;
          const isSecond = index === 1;

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
      </div>
    </div>
  );
}
