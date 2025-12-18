import { useState, useEffect } from 'react';
import type { ProductFragment } from 'storefrontapi.generated';
import { getProductDetails, type ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type TowelJuniorProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
};

export function TowelJuniorProduct({ product, productDetails }: TowelJuniorProductProps) {
    const [productDetailsState, setProductDetails] = useState<ProductDetails | null>(productDetails);

    // Fetch product details if not provided
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productDetails) {
                const details = await getProductDetails(product.id);
                setProductDetails(details);
            }
        };
        fetchProductDetails();
    }, [product.id, productDetails]);

    return (
        <div>
            <div className="max-w-8xl mx-auto">
                {/* Dynamic Content Sections – Alternating: Text first → Image first → Text first... */}
                {productDetailsState?.productContent1?.content?.map((item, index) => {
                    const isEvenIndex = index % 2 === 0; // 0, 2, 4 → Image Left (Text Right)
                    const isFirst = index === 0;

                    // For the very first section, force full-width treatment
                    if (isFirst) {
                        return (
                            <div key={index} className="w-full py-8">
                                <ProductDetailsContent1
                                    content={item}
                                    showImageLeft={true}        // Image Left → Text Right
                                    isTextFull={false}
                                    isImageFull={false}
                                    isFirst={true}
                                    isDescriptionFull={false}
                                    isSquareAspect={true}       // Apply square aspect ratio
                                    imageSize="xlarge"
                                />
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="py-12">
                            <ProductDetailsContent1
                                content={item}
                                showImageLeft={isEvenIndex}   // Even index (0,2,4) → Image Left (Text Right) → showImageLeft = true
                                // Odd index (1,3,5) → Text Left (Image Right) → showImageLeft = false
                                isTextFull={false}
                                isImageFull={false}
                                isFirst={false}
                                isDescriptionFull={false}
                                isSquareAspect={true}          // Apply square aspect ratio
                                imageSize="xlarge"
                            />
                        </div>
                    );
                })}

                {/* YouTube Section */}
                {productDetailsState?.youtubeVideos && (
                    <div className="mt-16 md:mt-20 lg:mt-24">
                        <Youtube youtubeVideo={productDetailsState.youtubeVideos} />
                    </div>
                )}
            </div>
        </div>
    );
}
