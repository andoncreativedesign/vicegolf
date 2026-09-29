import { Image } from "@shopify/hydrogen";
import { Link } from "react-router";
import { AedIcon } from "./ui/AedIcon";
import type { ProductFragment } from "storefrontapi.generated";
import { useMembership } from "~/hooks/useMembership";
import { YotpoRating } from "./yopto/YotpoRating";

interface ProductCardProps {
  product: ProductFragment;
  disableSoldout?: boolean;
  sessionDiscount?: any;
}

export function ProductCard({ product: _product, disableSoldout = false, sessionDiscount }: ProductCardProps) {
  const { getBestDiscountForProduct, automaticDiscounts } = useMembership();
  const product = _product as any;
  const variant = product.variants?.nodes[0];
  const image = product.featuredImage || product.images?.nodes[0];
  const price = variant?.price;
  const compareAtPrice = variant?.compareAtPrice;

  const productCollections = product.collections?.nodes?.map((c: any) => c.id) || [];
  const basePrice = parseFloat(price?.amount || '0');
  const { percentage: productPercentage, amount: productAmount } = getBestDiscountForProduct(product.id, productCollections, basePrice);

  let membershipPrice = basePrice;
  if (productAmount > 0) {
    membershipPrice = Math.max(0, basePrice - productAmount);
  } else if (productPercentage > 0) {
    membershipPrice = basePrice * (1 - productPercentage);
  }

  let sessionPrice = basePrice;
  if (sessionDiscount) {
    const isEligibleProduct = sessionDiscount.products?.includes(product.id);
    const isEligibleCollection = productCollections.some((id: string) => sessionDiscount.collections?.includes(id));
    if (sessionDiscount.appliesToAll || isEligibleProduct || isEligibleCollection) {
      if (sessionDiscount.percentage) {
        sessionPrice = basePrice * (1 - sessionDiscount.percentage);
      } else if (sessionDiscount.amount) {
        sessionPrice = Math.max(0, basePrice - parseFloat(sessionDiscount.amount.amount));
      }
    }
  }

  const unitPrice = Math.min(membershipPrice, sessionPrice);

  // Find the lowest possible volume price
  let bestVolumePrice = unitPrice;
  let bestVolumeQuantity = 1;

  if (automaticDiscounts && automaticDiscounts.length > 0) {
    let quantities = [1];
    automaticDiscounts.forEach((d: any) => {
      const isEligible = d.appliesToAll || d.eligibleProducts?.includes(product.id) || productCollections.some((id: string) => d.eligibleCollections?.includes(id));
      if (isEligible && d.minQuantity > 1 && !quantities.includes(d.minQuantity)) {
        quantities.push(d.minQuantity);
      }
    });

    quantities.forEach(qty => {
      let bestTotalForQty = unitPrice * qty;
      automaticDiscounts.forEach((d: any) => {
        const isEligible = d.appliesToAll || d.eligibleProducts?.includes(product.id) || productCollections.some((id: string) => d.eligibleCollections?.includes(id));
        if (isEligible && d.minQuantity <= qty) {
          let total = basePrice * qty;
          if (d.percentage) {
            total = total * (1 - d.percentage);
          } else if (d.amount) {
            let itemDiscount = d.amount;
            const discountCurrency = d.currencyCode;
            const activeCurrency = price?.currencyCode;
            const adminBasePrice = d.productPrices?.[product.id];

            if (discountCurrency && activeCurrency && activeCurrency !== discountCurrency && adminBasePrice) {
              itemDiscount = basePrice * (d.amount / adminBasePrice);
            }
            if (d.appliesOnEachItem) total = Math.max(0, basePrice - itemDiscount) * qty;
            else total = Math.max(0, total - itemDiscount);
          }
          if (total < bestTotalForQty) bestTotalForQty = total;
        }
      });
      const pricePerUnit = bestTotalForQty / qty;
      if (pricePerUnit < bestVolumePrice) {
        bestVolumePrice = pricePerUnit;
        bestVolumeQuantity = qty;
      }
    });
  }

  const finalPrice = bestVolumePrice;
  const isGolfBall = product.productType?.toLowerCase().includes('ball') || false;

  // 4. Show strikethrough if any discount is better than original or if Shopify has one
  let finalCompareAtPrice = parseFloat(compareAtPrice?.amount || '0');
  if (finalPrice < basePrice) {
    finalCompareAtPrice = basePrice;
  }

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
                {!product.availableForSale && !disableSoldout && (
                  <span className="bg-[#e2e2e2] text-[#3e3e40] text-[15px] font-medium px-4 py-2 rounded shadow-sm">
                    Sold out
                  </span>
                )}

                {product?.availableForSale && (product?.tags || [])?.map((tag: string) => {
                  const tagText = tag?.trim()?.replace(/^badge:/i, '')?.trim();
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
      <div className="flex flex-col flex-1 px-5 pb-5 pt-4 space-y-3">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[1.8rem]">
            {product.title}
          </h3>
        </div>

        {/* Category/Type */}
        <div className="mb-3">
          <p className="text-sm text-gray-500 font-medium tracking-wide">
            {product.productType || 'Golf Equipment'}
          </p>
        </div>

        <div className="flex items-center pt-2 pb-0">
          <YotpoRating productId={product.id?.split('/').pop() || product.id} />
        </div>

        {/* Price */}
        <div className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {price && (
                <>
                  <div className={`flex items-center ${finalCompareAtPrice > finalPrice ? 'text-[#e32619]' : 'text-gray-900'}`}>
                    <AedIcon className="mr-1" currency={price?.currencyCode} />
                    <span className="text-[17px] font-bold tracking-tight">
                      {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalPrice)}
                    </span>
                  </div>
                  {finalCompareAtPrice > finalPrice && (
                    <div className="flex items-center text-[15px] text-gray-500 line-through font-medium">
                      <AedIcon className="w-3.5 h-3.5 mr-0.5" currency={compareAtPrice?.currencyCode || price?.currencyCode} />
                      {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalCompareAtPrice)}
                    </div>
                  )}
                  {bestVolumeQuantity > 1 && (
                    <span className="text-[15px] font-medium text-gray-900 whitespace-nowrap">
                      from {bestVolumeQuantity} {isGolfBall ? 'dozen' : 'items'}
                    </span>
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
