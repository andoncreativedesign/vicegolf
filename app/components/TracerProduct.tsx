import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';

interface TracerProductProps {
    product: ProductFragment;
    productDetails: ProductDetails | null;
    initialRecommended?: any;
    showBestSellers?: boolean;
}

export function TracerProduct({
    product,
    productDetails,
    initialRecommended,
    showBestSellers = false,
}: TracerProductProps) {
    return (
        <div className="tracer-product">
            {/* Add your Tracer-specific product content here */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-6">Vice Pro Tracer</h2>
                {/* Add your Tracer product details, images, etc. */}
            </div>
        </div>
    );
}
