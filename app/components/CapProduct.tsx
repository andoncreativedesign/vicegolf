import { useEffect } from 'react';
import { type ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';

const ProductSummaryCap = () => {
    return null; // Summary section removed
};

type CapProductProps = {
    product: {
        id: string;
        productType?: string;
        tags?: string[];
    };
    productDetails: ProductDetails | null;
};

export function CapProduct({
    product,
    productDetails,
}: CapProductProps) {
    // No more recommended products or best sellers logic needed

    return (
        <div>
            <div className="max-w-8xl mx-auto">
                {/* Removed summary section */}
                <ProductSummaryCap />

                {/* Only the Product Details Content Sections */}
                {productDetails?.productContent1?.content?.map((item, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1;

                    if (isFirst || isSecond) {
                        return (
                            <div key={index} className={isFirst ? 'w-full' : 'w-full'}>
                                {isFirst ? (
                                    <div className="w-full">
                                        <div className="flex items-center">
                                            <div className="w-full py-8 mb-0">
                                                <ProductDetailsContent1
                                                    content={item}
                                                    showImageLeft={true}
                                                    isTextFull={false}
                                                    isImageFull={false}
                                                    isFirst={true}
                                                    isDescriptionFull={false}
                                                    imageSize="large"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-8xl mx-auto">
                                        <div className="min-h-[40vh]">
                                            <div className="flex flex-col space-y-8 h-full py-8">
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
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return null; // Skip all other items
                })}
            </div>
        </div>
    );
}