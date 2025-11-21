// app/components/BestSellers.tsx
import { ProductCard } from './ProductCard';
import type { ProductFragment } from 'storefrontapi.generated';

type BestSellersProps = {
    products: ProductFragment[];
    /**
     * The title to display above the best sellers section
     * If not provided, defaults to 'BEST SELLERS'
     * If set to null or empty string, no title will be shown
     */
    title?: string | null;
};

export function BestSellers({ 
    products, 
    title = 'BEST SELLERS' 
}: BestSellersProps) {
    return (
        <div className="best-sellers mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {title && (
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default BestSellers;