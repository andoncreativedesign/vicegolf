import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type { ProductFragment } from 'storefrontapi.generated';
import { useState, useRef, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { VariantProductCard } from './Product/VariantProductCard';

interface ProductGridProps {
  products: ProductFragment[];
  title?: string;
  categoryHandle?: string;
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function ProductGrid({
  products,
  title,
  categoryHandle,
  className = '',
  onLoadMore,
  hasMore = false,
  loading = false,
}: ProductGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!products?.length) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    );
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;
      setCanScrollRight(!isAtEnd || (hasMore && !loading));
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !onLoadMore || !hasMore || loading) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      if (scrollLeft > (scrollWidth - clientWidth) * 0.8) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, hasMore, loading]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      checkScrollButtons();
    }
  }, [products, hasMore]);


  return (
    <section className={`py-4 sm:py-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-1 sm:mb-2 text-black">
          <h2 className="uppercase tracking-normal" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', fontWeight: '700', lineHeight: '1.2' }}>
            {title}
          </h2>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 ${canScrollLeft
                ? 'border-gray-200 hover:border-black text-gray-800'
                : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                }`}
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 ${canScrollRight
                ? 'border-gray-200 hover:border-black text-gray-800'
                : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                }`}
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide select-none"
          onScroll={checkScrollButtons}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            marginInline: 'calc(-1 * var(--home-padding, 1rem))',
            paddingInline: 'var(--home-padding, 1rem)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex space-x-4 sm:space-x-8 pb-6">
            {products.map((product) => (
              <div key={product.id} className="w-[85vw] sm:w-[320px] md:w-[384px] flex-shrink-0 transition-transform duration-300">
                <div className="h-full">
                  {product?.family
                    ? <VariantProductCard product={product} />
                    : <ProductCard product={product} />
                  }
                </div>
              </div>
            ))}

            {(hasMore || loading) && (
              <div className="w-24 sm:w-48 flex-shrink-0 flex items-center justify-center">
                <div className="relative w-10 h-10">
                  <div className="w-full h-full bg-white rounded-full shadow-md border border-gray-100">
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Category-specific product grids
interface CategoryProductGridProps {
  products: ProductFragment[];
  categoryTitle: string;
  categoryHandle: string;
  className?: string;
}

export function CategoryProductGrid({
  products,
  categoryTitle,
  categoryHandle,
  className = '',
}: CategoryProductGridProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 lg:px-6 ${className}`}>
      <ProductGrid
        products={products}
        title={categoryTitle}
        categoryHandle={categoryHandle}
      />
    </div>
  );
}

// Multiple category grids
interface MultiCategoryGridProps {
  categories: Array<{
    title: string;
    handle: string;
    products: ProductFragment[];
  }>;
  className?: string;
}

export function MultiCategoryGrid({ categories, className = '' }: MultiCategoryGridProps) {
  return (
    <div className={`space-y-12 ${className}`}>
      {categories.map((category) => (
        <CategoryProductGrid
          key={category.handle}
          products={category.products}
          categoryTitle={category.title}
          categoryHandle={category.handle}
        />
      ))}
    </div>
  );
}