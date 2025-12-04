import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails, VideoContentItem, ProductContent1Item, Accordion2 } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import ProductDetailsContent2 from './Product/ProductDetailsContent2';
import { VideoSection } from './Product/VideoSection';
import ProductAccordion2 from './Product/ProductAccordion2';

type TracerProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
    initialRecommended?: any;
    showBestSellers?: boolean;
};

export function TracerProduct({ product, productDetails, initialRecommended, showBestSellers = true }: TracerProductProps) {
    const firstContent = productDetails?.productContent1?.content?.[0];
    const secondContent = productDetails?.productContent1?.content?.[1];
    const thirdContent = productDetails?.productContent1?.content?.[2];
    const videoContent = productDetails?.videoContent;

    if (!firstContent) return null;

    return (
        <div className="px-10 sm:px-12 lg:px-20 xl:px-24">
            <div className="max-w-8xl mx-auto space-y-8">
                {/* First Product Content */}
                <div className="w-full">
                    <div className="w-full">
                        <ProductDetailsContent1
                            content={firstContent}
                            showImageLeft={false}
                            isTextFull={true}
                            isImageFull={true}
                            isFirst={true}
                            isSecond={false}
                            isThird={false}
                            isDescriptionFull={true}
                            imageSize="xlarge"
                            titleClassName="text-4xl lg:text-5xl font-bold text-center"
                            descriptionClassName="text-base text-gray-600 w-full max-w-full text-center"
                            pointsClassName="w-full max-w-full text-center"
                        />
                    </div>
                </div>

                {/* Second Product Content */}
                {secondContent && (
                    <div className="w-full">
                        <div className="w-full">
                            <ProductDetailsContent1
                                content={secondContent}
                                showImageLeft={false}
                                isTextFull={true}
                                isImageFull={true}
                                isFirst={false}
                                isSecond={true}
                                isThird={false}
                                isDescriptionFull={true}
                                imageSize="xlarge"
                                titleClassName="text-4xl lg:text-5xl font-bold text-center"
                                descriptionClassName="text-base text-gray-600 w-full max-w-full text-center"
                                pointsClassName="w-full max-w-full text-center"
                            />
                        </div>
                    </div>
                )}

                {/* Video Section */}
                {videoContent && <VideoSection videoContent={videoContent} />}

                {/* Third Product Content */}
                {thirdContent && (
                    <div className="w-full min-h-[30vh] flex items-center">
                        <div className="w-full py-8 mb-0">
                            <ProductDetailsContent1
                                content={thirdContent}
                                showImageLeft={false}
                                isTextFull={false}
                                isImageFull={false}
                                isFirst={false}
                                isSecond={false}
                                isThird={true}
                                isDescriptionFull={false}
                                imageSize="large"
                                titleClassName="text-4xl lg:text-5xl font-bold"
                                descriptionClassName="text-base text-gray-600 w-[90%] max-w-[90%] ml-auto"
                                pointsClassName="w-[90%] max-w-[90%]"
                            />
                        </div>
                    </div>
                )}

                {/* Product Content 2 */}
                {productDetails?.productContent2?.sections?.map((section, index: number) => (
                    <div key={index}>
                        <ProductDetailsContent2 content={section} index={index} />
                    </div>
                ))}

                {/* Accordion 2 Section */}
                {productDetails?.accordion2 && (
                    <div className="mt-12">
                        <ProductAccordion2 accordion2={productDetails.accordion2} />
                    </div>
                )}
            </div>
        </div>
    );
}
