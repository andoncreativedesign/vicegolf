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
    sectionTitle?: string | null;
};

export function BestSellers({
    products,
    title = 'BEST SELLERS',
    sectionTitle = 'Our Best Sellers'
}: BestSellersProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const scrollAmount = 400; // Slightly increased scroll amount
        const currentScroll = scrollContainerRef.current.scrollLeft;

        scrollContainerRef.current.scrollTo({
            left: direction === 'left'
                ? Math.max(0, currentScroll - scrollAmount) // Prevent scrolling past start
                : currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="best-sellers w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="uppercase whitespace-pre-wrap max-w-prose text-title3 font-extrabold text-main-900">
                    {sectionTitle}
                </h2>
                {title && (
                    <h2 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h2>
                )}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => scroll('left')}
                        className="bg-white rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="bg-white rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-8 scrollbar-hide"
                >
                    {products.map((product) => (
                        <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BestSellers;