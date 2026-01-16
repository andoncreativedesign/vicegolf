import { Image, Money } from "@shopify/hydrogen";
import { Link } from "react-router";
import { useState, useMemo, useEffect } from "react";
import { AedIcon } from '../ui/AedIcon';

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
    family: FamilyMetaField;
    variantFamilyProducts: Omit<
      ProductCardProps['product'],
      'variants' |
      'variantFamilyProducts'
    >[]
  };
}

export function VariantProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants?.nodes[0];
  const image = product.featuredImage || product.images?.nodes?.[0];
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [currentImage, setCurrentImage] = useState(image?.url || '');
  const [selectedVariantHandle, setSelectedVariantHandle] = useState(product.handle);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoverDelayTimeout, setHoverDelayTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isOverVariants, setIsOverVariants] = useState(false);


  const allVariants = useMemo(() => {
    // Create a Set to track unique variant handles
    if (product.title === "Vice Pro Plus")
      console.log("product with variants  - ", product?.variantFamilyProducts?.[0])

    const seenHandles = new Set();
    const variants = [];

    // Add main product first if not already in the set
    if (!seenHandles.has(product.handle)) {
      seenHandles.add(product.handle);
      variants.push({
        ...product,
        isMain: true,
        id: product.handle,
        image: product.featuredImage || product.images?.nodes?.[0],
        variantImage: product.productType === "Golf Balls"
          ? product.variantImage || ""
          : product.variantImage || product.featuredImage,
      });
    }

    // Add variant family products, skipping any duplicates
    if (product.variantFamilyProducts?.length > 0) {
      product.variantFamilyProducts.forEach(variant => {
        if (!seenHandles.has(variant.handle)) {
          seenHandles.add(variant.handle);
          variants.push({
            ...variant,
            isMain: false,
            id: variant.handle,
            image: variant.featuredImage || variant.images?.nodes?.[0],
            variantImage: variant.variantImage || variant.featuredImage,
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
    setSelectedVariantHandle(variant.handle)
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
    // if (product.productType === 'Golf Balls' && product.variantFamilyProducts)
    if (product.variantFamilyProducts?.length > 0)
      console.log('product card golf balls', product)
  }, [product])

  // Add this effect to clean up the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (hoverDelayTimeout) {
        clearTimeout(hoverDelayTimeout);
      }
    };
  }, [hoverDelayTimeout]);


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
          >
            <div className="w-full h-full">
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
                    {allVariants[selectedVariant]?.availableForSale && (allVariants[selectedVariant]?.tags || [])?.filter((tag: string) => {
                      const t = tag?.trim()?.toLowerCase();
                      return t?.startsWith('badge:') || ['best', 'new', 'sale', 'trending', 'hot'].includes(t);
                    }).map((tag: string) => (
                      <span key={tag} className="bg-black text-white text-[15px] font-medium px-4 py-2 rounded shadow-sm capitalize">
                        {tag?.trim()?.replace(/^badge:/i, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Link>

        </div>

        {/* all other variants */}
        {!isGolfBall && isHovering && allVariants.length > 1 && (
          <div
            className="absolute bottom-18 left-0 right-0 z-30 p-2  bg-[#fafafa] backdrop-blur-sm "
            onClick={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-6 w-full">
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
                    className={`aspect-square rounded-lg transition-opacity duration-200 ${selectedVariant === index
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
            <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.8rem]">
              {product.title}
            </h3>
          </div>

          <p className="text-sm text-gray-500 font-medium">
            {product.productType || 'Golf Equipment'}
          </p>

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
                        className={`w-6 h-6 rounded-full overflow-hidden border transition-all duration-200 ${selectedVariant === index ? 'border-black scale-110' : 'border-gray-200'
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
                {firstVariant.compareAtPrice && (
                  <div className="flex items-center text-sm text-gray-400 line-through font-medium">
                    <AedIcon className="mr-0.5" />
                    {parseFloat(firstVariant.compareAtPrice.amount).toFixed(2)}
                  </div>
                )}
                <div className="flex items-center">
                  <AedIcon className="mr-1" />
                  <span className="text-xl font-bold tracking-tight">
                    {parseFloat(firstVariant.price.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}