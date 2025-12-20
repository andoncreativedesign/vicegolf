import { Image, Money } from "@shopify/hydrogen";
import { useEffect } from "react";
import { Link } from "react-router";
import type { ProductFragment } from "storefrontapi.generated";
import { AedIcon } from "./ui/AedIcon";

interface ProductCardProps {
  product: ProductFragment;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants?.nodes[0];
  const image = product.featuredImage || product.images?.nodes[0];

  const rating = 4.5 + Math.random() * 0.5;
  const reviewCount = Math.floor(Math.random() * 50) + 10;

  return (
    <div className="group flex flex-col h-full bg-[#fafafa] rounded-lg overflow-hidden ">
      {/* Product Image */}
      <Link
        to={`/products/${product.handle}`}
        className="block flex-shrink-0"
        style={{ textDecoration: 'none' }}
      >
        <div className="relative w-full bg-[#f6f6f6] overflow-hidden aspect-square">
          {image ? (
            <div className="w-full h-full">
              <Image
                data={image}
                alt={image.altText || product.title}
                className="w-full h-full object-cover object-center"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                width={300}
                height={300}
                style={{
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>
        </div>

        {/* Category/Type */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 font-medium tracking-wide">
            {product.productType || 'Golf Equipment'}
          </p>
        </div>
        {/* Rating */}
        {/* <div className="flex items-center space-x-1.5 pt-1">
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 flex-shrink-0 ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-200'
                  } transition-all duration-200`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium tracking-tight">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div> */}

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {firstVariant?.compareAtPrice && (
                <div className="flex items-center text-sm text-gray-400 line-through font-medium tracking-wide">
                  <AedIcon className="mr-0.5" />
                  <span>
                    {parseFloat(firstVariant.compareAtPrice.amount).toFixed(2)}
                  </span>
                </div>
              )}
              {firstVariant?.price && (
                <div className="flex items-center">
                  <AedIcon className="mr-1" />
                  <span className="text-xl font-bold text-red-600 tracking-tight">
                    {parseFloat(firstVariant.price.amount).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            {/* <span className="text-xs text-gray-400 font-medium tracking-wide">from 6 dozen</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

