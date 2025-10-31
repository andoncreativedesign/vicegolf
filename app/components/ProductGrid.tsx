import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {useState, useRef} from 'react';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: ProductFragment[];
  title?: string;
  categoryHandle?: string;
  className?: string;
}

export function ProductGrid({
  products,
  title,
  categoryHandle,
  className = '',
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
      const {scrollLeft, scrollWidth, clientWidth} = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: -300, behavior: 'smooth'});
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({left: 300, behavior: 'smooth'});
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className={`py-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition-colors duration-200 ${
                canScrollLeft 
                  ? 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition-colors duration-200 ${
                canScrollRight 
                  ? 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800' 
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        onScroll={checkScrollButtons}
        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 ">
            <ProductCard product={product} />
          </div>
        ))}
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

export function MultiCategoryGrid({categories, className = ''}: MultiCategoryGridProps) {
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