import { Image, Money } from "@shopify/hydrogen";
import { useEffect } from "react";
import { Link } from "react-router";
import type { ProductFragment } from "storefrontapi.generated";
import { AedIcon } from "./ui/AedIcon";
import { usePlusMember } from "~/hooks/usePlusMember";

interface ProductCardProps {
  product: ProductFragment;
}

export function ProductCard({ product: _product }: ProductCardProps) {
  const { isPlusMember, discountPercentage, discountAmount } = usePlusMember();
  const product = _product as any;
  const firstVariant = product.variants?.nodes[0];
  const image = product.featuredImage || product.images?.nodes[0];

  const rating = 4.5 + Math.random() * 0.5;
  const reviewCount = Math.floor(Math.random() * 50) + 10;

  // Calculate discounted price for all users with applicable discounts
  const originalPrice = parseFloat(product.variants?.nodes[0]?.price?.amount || '0');
  const displayPercentage = (discountPercentage * 100).toFixed(0);

  let discountedPrice = originalPrice;
  // Apply discount if available (for both Plus Members and regular users)
  if (discountAmount > 0) {
    discountedPrice = Math.max(0, originalPrice - discountAmount);
  } else if (discountPercentage > 0) {
    discountedPrice = originalPrice * (1 - discountPercentage);
  }

  const showPriceWithDiscount = discountPercentage > 0 || discountAmount > 0;

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
            <div className="w-full h-full relative">
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
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {!product.availableForSale && (
                  <span className="bg-[#e2e2e2] text-[#3e3e40] text-[15px] font-medium px-4 py-2 rounded shadow-sm">
                    Sold out
                  </span>
                )}

                {product?.availableForSale && (product?.tags || [])?.map((tag: string) => {
                  const tagText = tag?.trim()?.replace(/^badge:/i, '')?.trim();
                  if (tagText?.toLowerCase() === 'plus member') return null; // Hide the tag if we're showing the badge
                  const normalizedTag = tagText?.toLowerCase();
                  let customStyles = {};
                  try {
                    const rawColors = product.badge_colors;
                    const colorsString = typeof rawColors === 'string'
                      ? rawColors
                      : (rawColors as any)?.value;
                    const parsed = colorsString ? JSON.parse(colorsString) : {};
                    // Create case-insensitive lookup object
                    const badgeColors = Object.keys(parsed).reduce((acc: any, key) => {
                      acc[key.toLowerCase()] = parsed[key];
                      return acc;
                    }, {});
                    customStyles = badgeColors[normalizedTag] || {};
                  } catch (e) { }

                  return (
                    <span
                      key={tag}
                      className="text-[15px] font-medium px-4 py-2 rounded shadow-sm capitalize"
                      style={{
                        backgroundColor: (customStyles as any).bg || 'black',
                        color: (customStyles as any).text || 'white'
                      }}
                    >
                      {tagText}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {!product.availableForSale && (
                  <span className="bg-[#e2e2e2] text-[#3e3e40] text-[15px] font-medium px-4 py-2 rounded shadow-sm">
                    Sold out
                  </span>
                )}

                {product?.availableForSale && (product?.tags || [])?.map((tag: string) => {
                  const tagText = tag?.trim()?.replace(/^badge:/i, '')?.trim();
                  if (tagText?.toLowerCase() === 'plus member') return null;
                  const normalizedTag = tagText?.toLowerCase();
                  let customStyles = {};
                  try {
                    const colorsString = typeof product.badge_colors === 'string'
                      ? product.badge_colors
                      : (product.badge_colors as any)?.value;
                    const parsed = colorsString ? JSON.parse(colorsString) : {};
                    const badgeColors = Object.keys(parsed).reduce((acc: any, key) => {
                      acc[key.toLowerCase()] = parsed[key];
                      return acc;
                    }, {});
                    customStyles = badgeColors[normalizedTag] || {};
                  } catch (e) { }

                  return (
                    <span
                      key={tag}
                      className="text-[15px] font-medium px-4 py-2 rounded shadow-sm capitalize"
                      style={{
                        backgroundColor: (customStyles as any).bg || 'black',
                        color: (customStyles as any).text || 'white'
                      }}
                    >
                      {tagText}
                    </span>
                  );
                })}
              </div>
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

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {showPriceWithDiscount ? (
                <>
                  <div className="flex items-center text-sm text-gray-400 line-through font-medium tracking-wide">
                    <AedIcon className="mr-0.5" />
                    <span>
                      {originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-900">
                    <AedIcon className="mr-1" />
                    <span className="text-xl font-bold tracking-tight">
                      {discountedPrice.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {product.variants?.nodes[0]?.compareAtPrice && (
                    <div className="flex items-center text-sm text-gray-400 line-through font-medium tracking-wide">
                      <AedIcon className="mr-0.5" />
                      <span>
                        {parseFloat(product.variants.nodes[0].compareAtPrice.amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {product.variants?.nodes[0]?.price && (
                    <div className="flex items-center">
                      <AedIcon className="mr-1" />
                      <span className="text-xl font-bold tracking-tight">
                        {parseFloat(product.variants.nodes[0].price.amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
