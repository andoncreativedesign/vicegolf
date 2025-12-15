import type { ProductFragment } from 'storefrontapi.generated';
import type { ProductDetails } from '~/lib/sanity/products';

type DivotJuniorProductProps = {
    product: ProductFragment;
    productDetails: ProductDetails | null;
};

export function DivotJuniorProduct({ product, productDetails }: DivotJuniorProductProps) {
    return (
        <div className="px-6 sm:px-8 lg:px-12 xl:px-16 py-12">
            <div className="max-w-8xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">this is the junior divot page</h2>
            </div>
        </div>
    );
}
