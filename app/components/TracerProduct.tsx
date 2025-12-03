import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';
import ProductDetailsContent1 from './Product/ProductDetailsContent1';

type TracerProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
};

export function TracerProduct({ productDetails }: TracerProductProps) {
    const firstContent = productDetails?.productContent1?.content?.[0];

    if (!firstContent) return null;

    return (
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
                />
            </div>
        </div>
    );
}
