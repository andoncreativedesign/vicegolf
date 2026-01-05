import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';
import { BestSellers } from './BestSellers';


type PoloProductProps = {
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

export function PoloProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false
}: PoloProductProps) {
  // Debug recommended products
  useEffect(() => {
    console.log('Initial recommended products:', initialRecommended);
    if (initialRecommended?.nodes) {
      console.log('Recommended products nodes:', initialRecommended.nodes);
    }
  }, [initialRecommended]);

  return (
    <div>
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
                  <div className="flex items-center">
                    <div className="w-full py-8 mb-0">
                      <ProductDetailsContent1
                        content={item}
                        showImageLeft={!isEven}
                        isTextFull={isEven}
                        isImageFull={isEven}
                        isFirst={isFirst}
                        isDescriptionFull={false}
                        isSquareAspect={isFirst}
                        imageSize={isEven ? 'xlarge' : 'large'}
                        // removeMaxWidth={true}
                        imageClassName='sm:max-w-none max-w-xl lg:max-w-none '
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-8xl mx-auto">
                  <div className={isSecond ? 'min-h-[40vh]' : 'min-h-[35vh]'}>
                    <div className={`${isSecond ? 'flex flex-col space-y-8 h-full py-8' : 'h-full'}`}>
                      <ProductDetailsContent1
                        content={item}
                        showImageLeft={isSecond ? true : !isEven}
                        isTextFull={isEven}
                        isImageFull={isSecond ? true : isEven}
                        isDescriptionFull={isSecond ? true : false}
                        imageSize={isEven ? 'xlarge' : 'large'}
                        // removeMaxWidth={true}
                        imageClassName='sm:max-w-none max-w-xl lg:max-w-none '
                      />
                    </div>
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
        {showBestSellers &&
          initialRecommended?.products?.nodes?.length > 0 && (
            <div className="mt-16 md:mt-20 lg:mt-24 px-4 sm:px-6 lg:px-8">
              <BestSellers
                products={initialRecommended.products.nodes}
                title={null}
              />
            </div>
          )}
      </div>
    </div>
  );
}