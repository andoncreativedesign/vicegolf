// app/components/BestSellers.tsx
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const scrollAmount = 300; // Adjust this value to control scroll distance
        const currentScroll = scrollContainerRef.current.scrollLeft;

        scrollContainerRef.current.scrollTo({
            left: direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="best-sellers mt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
            {title && (
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                    {title}
                </h2>
            )}

            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide gap-8 pb-6 -mx-4 px-4"
                >
                    {products.map((product) => (
                        <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {/* Hide scrollbar visually but keep functionality */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

export default BestSellers;