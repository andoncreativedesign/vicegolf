import { ProductCard } from './ProductCard';
import type { ProductFragment } from 'storefrontapi.generated';

type BestSellersProps = {
    /**
     * The title to display above the best sellers section
     * If not provided, defaults to 'BEST SELLERS'
     * If set to null or empty string, no title will be shown
     */
    title?: string | null;
};

// Helper function to create mock product data
const createMockProduct = (id: number, title: string, price: string): ProductFragment => ({
    id: `gid://shopify/Product/${id}`,
    title,
    handle: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: `${title} - Premium quality golf equipment`,
    productType: 'Golf Equipment',
    featuredImage: null,
    images: {
        nodes: [],
    },
    variants: {
        nodes: [
            {
                id: `gid://shopify/ProductVariant/${id * 1000}`,
                price: {
                    amount: price.replace(/[^0-9.]/g, ''),
                    currencyCode: 'USD',
                },
                compareAtPrice: {
                    amount: (parseFloat(price.replace(/[^0-9.]/g, '')) * 1.2).toFixed(2),
                    currencyCode: 'USD',
                },
            },
        ],
    },
});

export function BestSellers({ title = 'BEST SELLERS' }: BestSellersProps) {
    // Dummy best sellers data formatted for ProductCard
    const bestSellers: ProductFragment[] = [
        createMockProduct(1, 'Premium Golf Balls (12 Pack)', '$49.99'),
        createMockProduct(2, 'Pro Golf Glove', '$24.99'),
        createMockProduct(3, 'Golf Tees (50 Pack)', '$9.99'),
        createMockProduct(4, 'Golf Towel', '$14.99'),
    ];

    return (
        <div className="best-sellers mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {title && (
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bestSellers.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default BestSellers;
