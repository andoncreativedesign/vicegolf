import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from '../Product/ProductDetailContents';
import ProductDetailsContent1 from '../Product/ProductDetailsContent1';
import { Youtube } from '../Youtube';
import { BestSellers } from '../BestSellers';


type DriversProductProps = {
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

export function DriversProduct({
  product,
  productDetails,
  initialRecommended,
  showBestSellers = false
}: DriversProductProps) {
  return (
    <div>
      <div className="w-full max-w-[1536px] mx-auto">

        {/* Youtube Video Section */}
        {productDetails && productDetails.youtubeVideos && (
          <div className="mt-16 md:mt-20 lg:mt-24">
            <Youtube youtubeVideo={productDetails.youtubeVideos} />
          </div>
        )}

        {/* Reusable What's New Section */}
        {productDetails?.productContent1?.content?.map((item, index) => {
          const isEven = (index + 1) % 2 === 0;
          const isFirst = index === 0;

          return (
            <div
              key={index}
              className={`${!isFirst ? 'w-full' : ''}`}
            >
              {!isFirst ? (
                <div className="w-full">
                  <div className="flex flex-col space-y-8 py-8">
                    <ProductDetailsContent1
                      content={item}
                      showImageLeft={false}
                      isTextFull={true}
                      isImageFull={true}
                      isDescriptionFull={true}
                      imageObjectFit='contain'
                      titleContainerClassName='lg:w-[1000px]'
                      titleClassName='lg:text-[48px] text-[32px] font-semibold w-full'
                      imageClassName="max-h-[672px] object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex flex-col space-y-8 py-8">
                    <ProductDetailsContent1
                      content={item}
                      showImageLeft={false}
                      isTextFull={true}
                      isDescriptionFull={true}
                      titleClassName='lg:text-[48px] text-[32px] font-semibold'
                      imageInnerContainerClassName='flex items-center justify-center'
                      imageSize='large'
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {showBestSellers &&
          initialRecommended?.products?.nodes?.length > 0 && (
            <div className="mt-16 md:mt-20 lg:mt-24 px-8">
              <BestSellers
                products={initialRecommended.products.nodes}
                title={null}
                sectionTitle="Explore our golf clubs"
              />
            </div>
          )}

      </div>
    </div>
  );
}
