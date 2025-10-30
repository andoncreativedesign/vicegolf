import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {useState, useRef} from 'react';

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
          <div key={product.id} className="flex-shrink-0 w-48">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: ProductFragment;
}

export function ProductCard({product}: ProductCardProps) {
  const firstVariant = product.variants.nodes[0];
  const image = product.featuredImage || product.images.nodes[0];

  // Generate mock rating (in real app, this would come from reviews data)
  const rating = 4.5 + Math.random() * 0.5; // Random rating between 4.5-5.0
  const reviewCount = Math.floor(Math.random() * 50) + 10; // Random review count 10-60

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group block bg-white hover:shadow-md transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg mb-3">
        {image ? (
          <Image
            data={image}
            alt={image.altText || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="200px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Wishlist Icon */}
        <button 
          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            // Handle wishlist toggle
          }}
        >
          <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-black transition-colors duration-200">
          {product.title}
        </h3>
        
        {/* Category/Type */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {product.productType || 'Golf Equipment'}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          {firstVariant?.compareAtPrice && (
            <Money
              data={firstVariant.compareAtPrice}
              className="text-sm text-gray-400 line-through"
            />
          )}
          {firstVariant?.price && (
            <Money
              data={firstVariant.price}
              className="text-base font-semibold text-red-600"
            />
          )}
          <span className="text-xs text-gray-500">from 6 dozen</span>
        </div>
      </div>
    </Link>
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
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
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