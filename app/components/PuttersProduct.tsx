import { useEffect } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { type ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type PuttersProductProps = {
    product: {
        id: string;
        productType?: string;
        tags?: string[];
        [key: string]: any;
    };
    productDetails: ProductDetails | null;
};

export function PuttersProduct({
    product,
    productDetails,
}: PuttersProductProps) {
    return (
        <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="max-w-8xl mx-auto">
                {/* Product Content Sections */}
                {productDetails?.productContent1?.content?.map((item, index) => {
                    const isEven = (index + 1) % 2 === 0;
                    const isFirst = index === 0;
                    const isSecond = index === 1;

                    return (
                        <div key={index} className={isFirst ? 'w-full' : ''}>
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
            </div>
        </div>
    );
}