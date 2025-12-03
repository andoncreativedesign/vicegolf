import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails, VideoContentItem, ProductContent1Item, Accordion2 } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
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
        <div className="space-y-8">
            {/* First Product Content */}
            <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
                <div className="max-w-8xl mx-auto py-8">
                    <ProductDetailsContent1
                        content={firstContent}
                        showImageLeft={false}
                        isTextFull={true}
                        isImageFull={true}
                        isDescriptionFull={true}
                        imageSize="xlarge"
                        isFirst={true}
                        titleClassName="text-4xl lg:text-5xl font-bold"
                        descriptionClassName="text-base w-[90%] max-w-[90%] ml-auto"
                    />
                </div>
            </div>

            {/* Second Product Content */}
            {secondContent && (
                <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
                    <div className="max-w-8xl mx-auto py-8">
                        <ProductDetailsContent1
                            content={secondContent}
                            showImageLeft={true}
                            isTextFull={true}
                            isImageFull={true}
                            isDescriptionFull={true}
                            imageSize="xlarge"
                            titleClassName="text-4xl lg:text-5xl font-bold"
                            descriptionClassName="text-base w-[90%] max-w-[90%]"
                        />
                    </div>
                </div>
            )}

            {/* Video Section */}
            {videoContent && <VideoSection videoContent={videoContent} />}

            {/* Third Product Content */}
            {thirdContent && (
                <div className="px-6 sm:px-8 lg:px-12 xl:px-16">
                    <div className="max-w-8xl mx-auto py-8">
                        <ProductDetailsContent1
                            content={thirdContent}
                            showImageLeft={false}
                            isTextFull={true}
                            isImageFull={true}
                            isDescriptionFull={true}
                            imageSize="xlarge"
                            titleClassName="text-4xl lg:text-5xl font-bold"
                            descriptionClassName="text-base w-[90%] max-w-[90%] ml-auto"
                        />
                    </div>
                </div>
            )}

            {/* Product Content 2 */}
            {productDetails?.productContent2?.sections?.map((section, index: number) => {
                if (!section) return null;
                return (
                    <div key={index} className="px-6 sm:px-8 lg:px-12 xl:px-16">
                        <div className="max-w-8xl mx-auto py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                {section.images?.map((image, imgIndex) => (
                                    <div key={imgIndex} className="relative aspect-square">
                                        {image?.asset?.url && (
                                            <img
                                                src={image.asset.url}
                                                alt={image.alt || ''}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="space-y-6">
                                    {section.contentItems?.map((item, itemIndex) => (
                                        <div key={itemIndex} className="space-y-2">
                                            <h3 className="text-2xl font-bold">{item.title}</h3>
                                            <p className="text-gray-600">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Accordion 2 Section */}
            {productDetails?.accordion2 && (
                <div className="px-6 sm:px-8 lg:px-12 xl:px-16 mt-12">
                    <div className="max-w-8xl mx-auto">
                        <ProductAccordion2 accordion2={productDetails.accordion2} />
                    </div>
                </div>
            )}
        </div>
    );
}
