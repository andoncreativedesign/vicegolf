import { useEffect, useState } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import { ProductDetailContents } from './Product/ProductDetailContents';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type DivotToolProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
};

export function DivotToolProduct({ product, productDetails }: DivotToolProductProps) {
    return (
        <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="max-w-8xl mx-auto">
                {/* Reusable What's New Section */}
                {productDetails?.productContent1?.content?.map((item, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;

                    return (
                        <div key={index} className={isFirst ? 'w-full' : ''}>
                            {isFirst ? (
                                // First section - Full width
                                <div className="w-full">
                                    <div className="flex items-center">
                                        <div className="w-full py-8 mb-0">
                                            <ProductDetailsContent1
                                                content={item}
                                                showImageLeft={true}  // Image will now appear above text
                                                isTextFull={true}
                                                isImageFull={true}
                                                isFirst={isFirst}
                                                isDescriptionFull={true}
                                                imageSize="xlarge"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Second section - Side by side
                                <div className="max-w-8xl mx-auto">
                                    <div className="min-h-[40vh]">
                                        <div className="h-full py-8">
                                            <ProductDetailsContent1
                                                content={item}
                                                showImageLeft={true}
                                                isTextFull={false}
                                                isImageFull={false}
                                                isDescriptionFull={false}
                                                imageSize="large"
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
            </div>
        </div>
    );
}
