import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';
import { BestSellers } from './BestSellers';

const ProductSummaryPolo = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        {/* Image section - left side */}
        <div className="w-full lg:w-[50%] max-w-xl">
          <div className="relative pb-[90%] rounded-lg overflow-hidden">
            <img
              src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/vice-golf-drip-polo-navy-body-image1.jpg?v=1751368007?width=1600&quality=80"
              alt="Vice Golf Polo Shirt"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        {/* Content section - right side */}
        <div className="w-full lg:w-[50%] flex items-center">
          <div className="w-full space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">The Definitive Golf Polo</h3>
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
              The original performance-focused Vice Golf Polo is a staple of every golfer's wardrobe. Crafted to be the definitive golfing polo, it's specifically engineered with a premium fabric blend featuring sweat-wicking properties to keep you cool when the heat is on. Cut for the course, it provides optimal movement through each swing and is reinforced in high-stress areas to maintain the sleek look and keep you looking sharp if you decide to take things beyond the course.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

type PoloProductProps = {
  product: {
    id: string;
    productType?: string;
    tags?: string[];
    [key: string]: any; // Allow other product properties
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
                  <div className="flex items-center">
                    <div className="w-full py-8 mb-0">
                      <ProductDetailsContent1
                        content={item}
                        showImageLeft={!isEven}
                        isTextFull={isEven}
                        isImageFull={isEven}
                        isFirst={isFirst}
                        isDescriptionFull={false}
                        imageSize={isEven ? 'xlarge' : 'large'}
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
          initialRecommended?.products?.nodes?.length > 0 &&
          (product.productType?.toLowerCase().includes('polo') ||
            product.tags?.some((tag: any) => typeof tag === 'string' && tag.toLowerCase().includes('polo'))) && (
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