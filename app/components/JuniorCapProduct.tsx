// app/components/JuniorCapProduct.tsx
import { useState, useEffect } from 'react';
import type { Product } from '@shopify/hydrogen/storefront-api-types';
import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';
import { getProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';
import { Youtube } from './Youtube';

type JuniorCapProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
    initialRecommended?: any;
    showBestSellers?: boolean;
};

export function JuniorCapProduct({ product, productDetails, initialRecommended, showBestSellers = false }: JuniorCapProductProps) {
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
                {/* Dynamic Content Sections – Alternating: Image first → Text first → Image first... */}
                {productDetailsState?.productContent1?.content?.map((item, index) => {
                    const isEvenIndex = index % 2 === 0; // 0, 2, 4 → Image Left
                    const isFirst = index === 0;

                    // For the very first section, force full-width treatment
                    if (isFirst) {
                        return (
                            <div key={index} className="w-full py-8">
                                <ProductDetailsContent1
                                    content={item}
                                    showImageLeft={true}
                                    isTextFull={false}
                                    isImageFull={false}
                                    isFirst={true}
                                    isDescriptionFull={false}
                                    isSquareAspect={true}      // Square aspect ratio is enabled
                                    imageSize="xlarge"
                                />
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="py-12">
                            <ProductDetailsContent1
                                content={item}
                                showImageLeft={isEvenIndex}
                                isTextFull={false}
                                isImageFull={false}
                                isFirst={false}
                                isDescriptionFull={false}
                                isSquareAspect={true}      // Square aspect ratio is enabled
                                imageSize="xlarge"
                            />
                        </div>
                    );
                })}

                {/* YouTube Section */}
                {productDetails?.youtubeVideos && (
                    <div className="mt-16 md:mt-20 lg:mt-24">
                        <Youtube youtubeVideo={productDetails.youtubeVideos} />
                    </div>
                )}
            </div>
        </div>
    );
}