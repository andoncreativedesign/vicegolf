import { Image, Money } from "@shopify/hydrogen";
import { Link } from "react-router";
import { useState, useMemo, useEffect } from "react";
import { AedIcon } from '../ui/AedIcon';
import { useMembership } from "~/hooks/useMembership";
import { YotpoRating } from "../yopto/YotpoRating";

type ColorOption = {
  id: string;
  name: string;
  color: string;
  available: boolean;
}

type FamilyMetaField = {
  id: string;
  key: string;
  namespace: string;
  type: string;
  value: string;
}

type ProductCardProps = {
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage?: {
      url: string;
      altText?: string;
    };
    variantImage?: any;
    images?: {
      nodes: Array<any>;
    };
    variants?: {
      nodes: Array<{
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        };
      }>;
    };
    availableForSale: boolean;
    productType?: string;
    tags?: string[];
    badge_colors?: string;
    family: FamilyMetaField;
    collections?: {
      nodes: Array<{ id: string }>;
    };
    variantFamilyProducts: Omit<
      ProductCardProps['product'],
      'variants' |
      'variantFamilyProducts'
    >[]
  };
  sessionDiscount?: any;
}

export function VariantProductCard({ product, sessionDiscount }: ProductCardProps) {
  const firstVariant = product.variants?.nodes[0];
  const image = product.featuredImage || product.images?.nodes?.[0];

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [currentImage, setCurrentImage] = useState(image?.url || '');
  const [selectedVariantHandle, setSelectedVariantHandle] = useState(product.handle);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoverDelayTimeout, setHoverDelayTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isOverVariants, setIsOverVariants] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.id?.split('/').pop() || product.id);

  const allVariants = useMemo(() => {
    const seenHandles = new Set();
    const variants = [];

    // Add main product first if not already in the set
    if (!seenHandles.has(product.handle)) {
      seenHandles.add(product.handle);
      const mainVariantImage = product.variantImage?.reference?.image || product.variantImage || null;
      variants.push({
        ...product,
        isMain: true,
        // id: product.handle,
        id: product.id,
        image: product.featuredImage || product.images?.nodes?.[0],
        variantImage: mainVariantImage || product.featuredImage || "",
      });
    }

    // Add variant family products, skipping any duplicates
    if (product.variantFamilyProducts?.length > 0) {
      product.variantFamilyProducts.forEach(variant => {
        if (!seenHandles.has(variant.handle)) {
          seenHandles.add(variant.handle);
          const famVariantImage = variant.variantImage?.reference?.image || variant.variantImage || null;
          variants.push({
            ...variant,
            isMain: false,
            // id: variant.handle,
            id: variant.id,
            image: variant.featuredImage || variant.images?.nodes?.[0],
            variantImage: famVariantImage || variant.featuredImage || "",
          });
        }
      });
    }

    return variants;
  }, [product]);

  // Set initial image
  useEffect(() => {
    if (allVariants[0]?.image?.url) {
      setCurrentImage(allVariants[0].image.url);
    }
  }, [allVariants]);

  const handleVariantSelect = (e: React.MouseEvent, variant: any, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariant(index);
    setSelectedVariantHandle(variant.handle);
    setSelectedVariantId(variant.id?.split('/')?.pop() || variant.id);
    if (variant.image?.url) {
      setCurrentImage(variant.image?.url);
    }
  };

  const handlePreviewClick = (e: React.MouseEvent, imgUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(imgUrl);
  };

  const isGolfBall = product.productType?.toLowerCase().includes('golf ball') ||
    product.tags?.some(tag => tag.toLowerCase().includes('golf ball'));

  const colorOptions: ColorOption[] = [
    { id: 'white', name: 'White', color: 'bg-white border', available: true },
    { id: 'yellow', name: 'Yellow', color: 'bg-yellow-300', available: true },
    { id: 'green', name: 'Green', color: 'bg-green-500', available: true },
    { id: 'orange', name: 'Orange', color: 'bg-orange-400', available: true },
    { id: 'pink', name: 'Pink', color: 'bg-pink-400', available: true }
  ];

  const colorVariantImages = useMemo(() => {
    if (!product.images?.nodes) return [];

    return colorOptions
      .filter(color => color.available)
      .map(color => ({
        ...color,
        image: product.images?.nodes.find(img =>
          img.altText?.toLowerCase().includes(color.name.toLowerCase())
        ) || product.featuredImage
      }));
  }, [product.images, product.featuredImage, colorOptions]);

  const rating = 4.5 + Math.random() * 0.5;
  const reviewCount = Math.floor(Math.random() * 50) + 10;

  useEffect(() => {
    if (product.variantFamilyProducts?.length > 0) {
      // Add your effect logic here
    }
  }, [product]);

  useEffect(() => {
    return () => {
      if (hoverDelayTimeout) {
        clearTimeout(hoverDelayTimeout);
      }
    };
  }, [hoverDelayTimeout]);

  const { getBestDiscountForProduct, automaticDiscounts } = useMembership();
  const productCollections = product.collections?.nodes?.map((c: any) => c.id) || [];
  const basePrice = parseFloat(firstVariant?.price?.amount || '0');

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
          if (d.percentage) total = total * (1 - d.percentage);
          else if (d.amount) {
            if (d.appliesOnEachItem) total = Math.max(0, basePrice - d.amount) * qty;
            else total = Math.max(0, total - d.amount);
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

  // 4. Show strikethrough if any discount is better than original or if Shopify has one
  let finalCompareAtPrice = parseFloat(firstVariant?.compareAtPrice?.amount || '0');
  if (finalPrice < basePrice) {
    finalCompareAtPrice = basePrice;
  }


  return (
    <div className="group relative flex flex-col h-full bg-[#fafafa] rounded-lg overflow-hidden ">
      <div className="relative w-full overflow-hidden">
        <div
          className="relative w-full bg-[#f6f6f6] overflow-hidden aspect-square"
          onMouseEnter={() => {
            // Clear any pending timeouts when entering
            if (hoverDelayTimeout) {
              clearTimeout(hoverDelayTimeout);
              setHoverDelayTimeout(null);
            }
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            // Only hide if not over variants
            const timeout = setTimeout(() => {
              if (!isOverVariants) {
                setIsHovering(false);
              }
            }, 300);
            setHoverDelayTimeout(timeout);
          }}

        >
          <Link
            to={`/products/${selectedVariantHandle}`}
            style={{ textDecoration: 'none' }}
            className="cursor-pointer"
          >
            <div className="w-full h-full cursor-pointer">
              {image && (
                <div className="relative w-full h-full bg-[#f6f6f6] overflow-hidden">
                  <Image
                    src={currentImage || image.url}
                    alt={image.altText || product.title}
                    className="w-full h-full object-cover object-center transition-transform duration-300"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    width={400}
                    height={400}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {allVariants[selectedVariant] && !allVariants[selectedVariant].availableForSale && (
                      <span className="bg-[#e2e2e2] text-[#3e3e40] text-[15px] font-medium px-4 py-2 rounded shadow-sm">
                        Sold out
                      </span>
                    )}

                    {allVariants[selectedVariant]?.availableForSale && (allVariants[selectedVariant]?.tags || []).map((tag: string) => {
                      const tagText = tag?.trim()?.replace(/^badge:/i, '')?.trim();
                      const normalizedTag = tagText?.toLowerCase();
                      let customStyles = {};
                      try {
                        const rawColors = allVariants[selectedVariant]?.badge_colors || product.badge_colors;
                        const colorsString = typeof rawColors === 'string'
                          ? rawColors
                          : (rawColors as any)?.value;
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

        </div>

        {/* all other variants */}
        {!isGolfBall && isHovering && allVariants.length > 1 && (
          <div
            className="absolute bottom-25 left-0 right-0 z-30 p-2  bg-[#fafafa] backdrop-blur-sm "
            onClick={(e) => e.preventDefault()}
          >
            <div className="w-full flex justify-start gap-1">
              {allVariants
                .sort((a, b) => {
                  // Move current variant to the start
                  if (a.handle === product.handle) return -1;
                  if (b.handle === product.handle) return 1;
                  return 0;
                })
                ?.map((variant, index) => (
                  <button
                    key={variant.id}
                    className={`aspect-square rounded-lg transition-opacity duration-200 cursor-pointer ${selectedVariant === index
                      ? '' : ''
                      } ${!variant.availableForSale ? 'opacity-40' : ''}`}
                    onClick={(e) => handleVariantSelect(e, variant, index)}
                    onMouseEnter={() => {
                      setIsOverVariants(true);
                      // Change main image on hover
                      if (variant.image?.url) {
                        setCurrentImage(variant.image.url);
                      }
                      // Clear any pending hide timeout
                      if (hoverDelayTimeout) {
                        clearTimeout(hoverDelayTimeout);
                        setHoverDelayTimeout(null);
                      }
                    }}
                    onMouseLeave={() => {
                      setIsOverVariants(false);
                      // Revert to selected variant's image when leaving
                      if (allVariants[selectedVariant]?.image?.url) {
                        setCurrentImage(allVariants[selectedVariant].image.url);
                      }
                      // Start the hide timeout when leaving the variants
                      const timeout = setTimeout(() => {
                        setIsHovering(false);
                      }, 1000);
                      setHoverDelayTimeout(timeout);
                    }}
                  >
                    {typeof variant.variantImage === 'object' && variant.variantImage?.url ? (
                      <Image
                        src={variant.variantImage.url}
                        alt={variant.title}
                        width={56}
                        height={56}
                        sizes="(max-width: 48em) 55px, 100px"
                        className="w-full h-full max-w-[48px] max-h-[48px] sm:max-w-[52px] sm:max-h-[52px] md:max-w-[55px] md:max-h-[55px] object-cover transition-transform duration-200"
                      />
                    ) : typeof variant.variantImage === 'string' && variant.variantImage ? (
                      <Image
                        src={variant.variantImage}
                        alt={variant.title}
                        width={56}
                        height={56}
                        sizes="(max-width: 48em) 55px, 100px"
                        className="w-full h-full max-w-[48px] max-h-[48px] sm:max-w-[52px] sm:max-h-[52px] md:max-w-[55px] md:max-h-[55px] object-cover transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-[10px] text-gray-400">No Image</span>
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 px-5 pb-5 pt-4 space-y-3">
          <div className="relative">
            <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[1.8rem]">
              {product.title}
            </h3>
          </div>

          <p className="text-sm text-gray-500 font-medium">
            {product.productType || 'Golf Equipment'}
          </p>

          <div className="flex items-center pt-2 pb-0">
            <YotpoRating productId={selectedVariantId} />
          </div>

          {/* ball variants */}
          {isGolfBall && allVariants.length > 1 && (
            <div className="pt-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Options:</span>
                <div className="flex flex-wrap gap-2">
                  {allVariants
                    .sort((a, b) => {
                      if (a.handle === product.handle) return -1;
                      if (b.handle === product.handle) return 1;
                      return 0;
                    })
                    .map((variant, index) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={(e) => {
                          handleVariantSelect(e, variant, index);
                          if (variant.image?.url) {
                            setCurrentImage(variant.image.url);
                          }
                        }}
                        className={`w-6 h-6 rounded-full overflow-hidden border transition-all duration-200 cursor-pointer ${selectedVariant === index ? 'border-black scale-110' : 'border-gray-200'
                          } ${!variant.availableForSale ? 'opacity-40' : ''}`}
                        title={`${variant.title}${!variant.availableForSale ? ' (Sold Out)' : ''}`}
                      >
                        {typeof variant.variantImage === 'object' && variant.variantImage?.url ? (
                          <img
                            src={variant.variantImage.url}
                            alt={variant.title}
                            className="w-full h-full object-cover"
                          />
                        ) : typeof variant.variantImage === 'string' && variant.variantImage ? (
                          <img
                            src={variant.variantImage}
                            alt={variant.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </button>
                    ))}
                  {allVariants.length > 5 && (
                    <span className="text-xs text-gray-400 self-center">+{allVariants.length - 5}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {firstVariant && (
            <div className="flex items-center justify-between pt-1 mt-auto">
              <div className="flex items-center space-x-2">
                {(finalCompareAtPrice > finalPrice) && (
                  <div className="flex items-center text-sm text-gray-400 line-through font-medium">
                    <AedIcon className="mr-0.5" />
                    {finalCompareAtPrice.toFixed(2)}
                  </div>
                )}
                <div className="flex items-center">
                  <AedIcon className="mr-1" />
                  <span className="text-xl font-bold tracking-tight">
                    {finalPrice.toFixed(2)}
                  </span>
                  {bestVolumeQuantity > 1 && (
                     <span className="text-sm font-medium text-gray-900 ml-2 whitespace-nowrap">from {bestVolumeQuantity} dozen</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}