import { Image, Money } from "@shopify/hydrogen";
import { Link } from "react-router";
import type { ProductFragment } from "storefrontapi.generated";

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
      className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-290 p-2 border border-gray-100 lg:min-w-[300px]"
      style={{ textDecoration: 'none' }}
    >
      {/* Product Image */}
      <div className="relative h-64 w-full bg-gray-50 overflow-hidden rounded-lg mb-5">
        {image ? (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              data={image}
              alt={image.altText || product.title}
              className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
              sizes="(min-width: 1024px) 300px, 200px"
              width={300}
              height={300}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Wishlist Icon */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            // Handle wishlist toggle
          }}
        >
          <svg className="w-5 h-5 text-gray-700 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-3 no-underline hover:no-underline">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 group-hover:text-black transition-colors duration-200 flex items-center no-underline hover:no-underline">
          {product.title}
        </h3>
        
        {/* Category/Type */}
        <p className="text-sm text-gray-600 font-medium no-underline hover:no-underline">
          {product.productType || 'Golf Equipment'}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
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
        <div className="flex items-center space-x-2 mt-1">
          {firstVariant?.compareAtPrice && (
            <Money
              data={firstVariant.compareAtPrice}
              className="text-sm text-gray-500 line-through"
            />
          )}
          {firstVariant?.price && (
            <Money
              data={firstVariant.price}
              className="text-lg font-bold text-red-600"
            />
          )}
          <span className="text-sm text-gray-500 ml-1">from 6 dozen</span>
        </div>
      </div>
    </Link>
  );
}
