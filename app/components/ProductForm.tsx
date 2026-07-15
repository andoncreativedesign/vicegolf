import { useNavigate, useRouteLoaderData } from 'react-router';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import { ProductPrice } from './ProductPrice';
import { QuantitySelector } from './QuantitySelector';
import { ShippingInfo } from './ShippingInfo';
import { ProductDetailsAccordions } from './ProductDetailsAccordions';
import type { ProductFragment } from 'storefrontapi.generated';
import { useState, useEffect, forwardRef } from 'react';
import type { AccordionItem } from '~/lib/sanity/products';
import type { ClubVariant, UIColorVariant } from '~/lib/shopify/product-queries';
import ColorVariant from './Product/ColorVariant';
import VariantGroup from './Product/VariantGroup';
import type { ShippingDetails } from '~/lib/sanity/home';
import { AedIcon } from './ui/AedIcon';
import ProductCustomization from './basic/ProductCustomization';
import { useMembership } from '~/hooks/useMembership';
import { YotpoRating } from './yopto/YotpoRating';

export type ProductFormProps = {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  title: string;
  description: string;
  productType?: string;
  productAccordions: AccordionItem[];
  colorVariants?: UIColorVariant[];
  shippingDetails?: ShippingDetails | null;
  clubVariants?: ClubVariant[];
  currentProductId: string;
  collectionIds?: string[];
  bundleBtn: {
    text: string;
    handle: string;
  } | null;
  sessionDiscount?: any;
  product: any;
  optionSubtext?: {
    text?: string;
    color?: string;
    size?: string;
  };
  specialVariants?: UIColorVariant[];
  selectedSpecialVariant?: any;
};

export const ProductForm = forwardRef<HTMLDivElement, ProductFormProps>(({
  productOptions,
  selectedVariant,
  title,
  description,
  productType,
  productAccordions,
  colorVariants,
  shippingDetails,
  clubVariants,
  currentProductId,
  bundleBtn,
  collectionIds,
  sessionDiscount,
  product,
  optionSubtext,
  specialVariants,
  selectedSpecialVariant,
}, ref) => {
  const originalUnitPrice = parseFloat(selectedVariant?.price?.amount || '0');

  const { getBestDiscountForProduct } = useMembership();
  const { percentage: productPercentage, amount: productAmount } = getBestDiscountForProduct(currentProductId, collectionIds, originalUnitPrice);

  const navigate = useNavigate();
  const { open } = useAside();
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState('1');
  const totalQuantityDozens = selectedTier === 'custom' ? quantity : parseInt(selectedTier);

  const rootData = useRouteLoaderData<any>('root');
  const automaticDiscounts = rootData?.automaticDiscounts || [];

  const applicableDiscounts = automaticDiscounts.filter((d: any) => {
    const isEligibleProduct = d.eligibleProducts?.includes(currentProductId);
    const isEligibleCollection = collectionIds?.some((id: string) => d.eligibleCollections?.includes(id));
    return d.appliesToAll || isEligibleProduct || isEligibleCollection;
  });

  // 1. Calculate price with membership discount
  let membershipPrice = originalUnitPrice;
  if (productAmount > 0) {
    membershipPrice = Math.max(0, originalUnitPrice - productAmount);
  } else if (productPercentage > 0) {
    membershipPrice = originalUnitPrice * (1 - productPercentage);
  }

  // 2. Calculate price with session discount (starting from original price)
  let sessionPrice = originalUnitPrice;
  let isSessionEligible = false;
  if (sessionDiscount) {
    const isEligibleProduct = sessionDiscount.products?.includes(currentProductId);
    const isEligibleCollection = collectionIds?.some((id: string) => sessionDiscount.collections?.includes(id));

    if (sessionDiscount.appliesToAll || isEligibleProduct || isEligibleCollection) {
      isSessionEligible = true;
      if (sessionDiscount.percentage) {
        sessionPrice = originalUnitPrice * (1 - sessionDiscount.percentage);
      } else if (sessionDiscount.amount) {
        sessionPrice = Math.max(0, originalUnitPrice - parseFloat(sessionDiscount.amount.amount));
      }
    }
  }

  // 3. Choose the best price (lowest) for the user
  const unitPriceAmount = Math.min(membershipPrice, sessionPrice);

  // 4. Show strikethrough if any discount is better than original or if Shopify has one
  let unitCompareAmount = parseFloat(selectedVariant?.compareAtPrice?.amount || '0');
  if (unitPriceAmount < originalUnitPrice) {
    unitCompareAmount = originalUnitPrice;
  }

  const getBestPriceForQuantity = (qty: number) => {
    let bestTotal = unitPriceAmount * qty;
    for (const d of applicableDiscounts) {
      if (d.minQuantity && qty >= d.minQuantity) {
        let total = originalUnitPrice * qty;
        if (d.percentage) {
           total = total * (1 - d.percentage);
        } else if (d.amount) {
           if (d.appliesOnEachItem) {
               total = Math.max(0, originalUnitPrice - d.amount) * qty;
           } else {
               total = Math.max(0, total - d.amount);
           }
        }
        if (total < bestTotal) bestTotal = total;
      }
    }
    return bestTotal;
  };

  const totalPriceAmount = getBestPriceForQuantity(totalQuantityDozens);
  const totalCompareAmount = unitCompareAmount * totalQuantityDozens;
  const currencyCode = selectedVariant?.price?.currencyCode || 'USD';
  const showCompare = unitCompareAmount > unitPriceAmount || totalPriceAmount < (unitPriceAmount * totalQuantityDozens);
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  let hasVolumeDiscount = false;
  applicableDiscounts.forEach((d: any) => {
    if (d.minQuantity && d.minQuantity > 1) {
      hasVolumeDiscount = true;
    }
  });

  let tierQuantities: number[] = [];
  if (hasVolumeDiscount) {
    tierQuantities = [1];
    applicableDiscounts.forEach((d: any) => {
      if (d.minQuantity && d.minQuantity > 1 && !tierQuantities.includes(d.minQuantity)) {
        tierQuantities.push(d.minQuantity);
      }
    });
  }
  tierQuantities.sort((a, b) => a - b);

  const isGolfBall = productType?.toLowerCase().includes('ball') || false;
  const getUnitLabel = (qty: number) => {
    if (isGolfBall) return 'dozen';
    return qty === 1 ? 'item' : 'items';
  };

  const pricingTiers = tierQuantities.map(qty => {
    const price = getBestPriceForQuantity(qty);
    const unitPrice = price / qty;
    const oldPriceTotal = unitCompareAmount * qty;
    return {
      key: qty.toString(),
      label: `${qty} ${getUnitLabel(qty)}`,
      price: formatPrice(price),
      oldPrice: (showCompare || oldPriceTotal > price) ? formatPrice(oldPriceTotal) : undefined,
      unitPrice: formatPrice(unitPrice),
      oldUnitPrice: (showCompare || unitCompareAmount > unitPrice) ? formatPrice(unitCompareAmount) : undefined
    };
  });

  const handleCustomQuantity = (q: number) => {
    const newQuantity = Math.max(1, q);
    setQuantity(newQuantity);
    
    // Check if the new quantity matches any available Dozen tier
    const matchingTier = pricingTiers.find(tier => parseInt(tier.key) === newQuantity);
    
    if (matchingTier) {
      setSelectedTier(matchingTier.key);
    } else {
      setSelectedTier('custom');
    }
  };
  const handleAddToCart = () => {
    // window?.dataLayer?.push({
    //   event: "add_to_cart",
    //   ecommerce: {
    //     value: totalPriceAmount,
    //     currency: currencyCode
    //   }
    // });
    // open('cart');

    if (typeof window !== 'undefined' && (window as any).fbq) {
      console.log('FB Pixel fired', {
        currency: currencyCode,
        value: totalPriceAmount,
        content_ids: [currentProductId],   // REQUIRED for proper tracking
        content_name: title,
        content_type: 'product'
      });

      // (window as any).fbq('track', 'AddToCart', {
      //   value: totalPriceAmount,
      //   currency: currencyCode
      // });
      (window as any).fbq('track', 'AddToCart', {
        currency: currencyCode,
        value: totalPriceAmount,
        content_ids: [currentProductId],   // REQUIRED for proper tracking
        content_name: title,
        content_type: 'product'
      });
    }

    if (typeof window !== 'undefined' && (window as any)._learnq) {
      const item = {
        'ProductName': title,
        'ProductID': currentProductId,
        'SKU': selectedVariant?.sku,
        'ImageURL': selectedVariant?.image?.url,
        'URL': window.location.href,
        'Price': unitPriceAmount,
        'Quantity': totalQuantityDozens,
        'Value': totalPriceAmount
      };
      (window as any)._learnq?.push(['track', 'Added to Cart', item]);
    }
    open('cart');
  };
  const getProductCustomizationStyleType = (productType: string | undefined): 'drivers' | 'club' | 'default' => {
    const DRIVER_TYPES = ['drivers', 'hybrids', 'fairway woods', 'mallet putter', 'blade putter', 'center mallet putter'];
    const CLUB_TYPES = ['golf club set', 'golf clubs', 'wedges', 'irons', 'drivers'];
    const type = productType?.toLowerCase() || '';
    if (DRIVER_TYPES.some(t => type.includes(t))) {
      return 'drivers';
    }

    if (CLUB_TYPES.some(t => type.includes(t))) {
      return 'club';
    }

    return 'default';
  };

  // Check if quantity selector should be shown for the product type
  const shouldShowQuantitySelector = (productType: string | undefined): boolean => {
    const typesWithoutQuantity = [
      'irons',
      'wedges',
      'blade putter',
      'mallet putter',
      'center mallet putter',
      'fairway woods',
      'hybrids',
      'drivers'
    ];

    const type = productType?.toLowerCase() || '';
    return !typesWithoutQuantity.some(t => type.includes(t));
  };

  const handleBundleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(`/products/${bundleBtn?.handle}`);
  };

  return (
    <div
      ref={ref}
      // REMOVED: max-width constraints, KEEP: width 100%
      // ADDED: Some padding for better spacing on larger screens
      className="product-form py-4 md:py-5 w-full"
    >
      {/* Product Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      {productType && (
        <div className="text-sm text-gray-500 mb-2">{productType}</div>
      )}

      {/* Product Price */}
      <div className="mb-6">
        <ProductPrice
          price={{ amount: totalPriceAmount.toFixed(2), currencyCode }}
          compareAtPrice={showCompare ? { amount: totalCompareAmount.toFixed(2), currencyCode } : undefined}
        />
        {showCompare && (
          <span className="text-sm text-emerald-600 font-medium ml-2 flex items-center inline-flex">
            (Save <AedIcon className="w-3 h-3 mx-0.5" /> {(totalCompareAmount - totalPriceAmount).toFixed(2)})
          </span>
        )}
      </div>

      <YotpoRating
        productId={product.id.split('/')[product.id.split('/').length - 1]}
      />

      {/* Product Description */}
      {description && (
        <div
          className="product-description mb-6 text-gray-600 text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {/* Color Variants Section */}
      {colorVariants && colorVariants.length > 0 && (
        <>
          {specialVariants?.length ? (
            <VariantGroup
              productType={productType?.toLowerCase()}
              colorVariants={colorVariants}
              selectedVariant={selectedVariant}
            />
          ) : (
            <ColorVariant
              productType={productType?.toLowerCase()}
              colorVariants={colorVariants}
              selectedVariant={selectedVariant}
            />
          )}
        </>
      )}

      {specialVariants && specialVariants.length > 0 && (
        <ColorVariant
          productType={productType?.toLowerCase()}
          colorVariants={specialVariants}
          selectedVariant={selectedSpecialVariant}
          label="Special & Limited Editions"
        />
      )}

      {<ProductCustomization
        productOptions={productOptions}
        styling={getProductCustomizationStyleType(productType)}
        clubVariants={clubVariants}
        currentProductId={currentProductId}
        optionSubtext={optionSubtext}
      />
      }

      {/* Fallback Option Subtext for products without a 'size' option */}
      {!productOptions?.some(opt => opt.name?.toLowerCase().includes('size')) && optionSubtext?.text && (
        <div className="product-form-container">
          <p 
            className="text-sm font-medium text-gray-900 mb-3"
            style={{
              color: optionSubtext.color || undefined,
              fontSize: optionSubtext.size || undefined
            }}
          >
            {optionSubtext.text}
          </p>
        </div>
      )}

      {/* Quantity Selector - Only show for products that need quantity selection */}
      {shouldShowQuantitySelector(productType) && (
        <div className="mb-6">
          <QuantitySelector
            selectedTier={selectedTier}
            setSelectedTier={(tier) => {
              setSelectedTier(tier);
              if (tier !== 'custom') {
                setQuantity(parseInt(tier));
              }
            }}
            quantity={quantity}
            setQuantity={handleCustomQuantity}
            pricingTiers={pricingTiers}
            unitPrice={unitPriceAmount}
            currencyCode={currencyCode}
          />
        </div>
      )}

      {/* bundleBtn && (
        <div className="mb-6 md:max-w-[399px]">
          <button
            className="w-full cursor-pointer bg-white text-black border border-black py-4 px-6 rounded-full font-medium text-base transition-all duration-300"
            onClick={(e) => handleBundleBtnClick(e)}
          >
            {bundleBtn?.text || 'not text'}
          </button>
        </div>
      ) */}

      {/* Add to Cart Button */}
      <div className="mb-6">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={handleAddToCart}
          lines={
            selectedVariant
              ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: totalQuantityDozens,
                  selectedVariant,
                },
              ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? (
            <span className="flex items-center justify-center gap-1">
              Add to Cart • <AedIcon className="w-3 h-3 text-white" />
              {new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(totalPriceAmount)}
            </span>
          ) : (
            'Out of stock'
          )}
        </AddToCartButton>
      </div>

      {/* Shipping Info */}
      {shippingDetails &&
        <div className="mb-6">
          <ShippingInfo shippingDetails={shippingDetails} />
        </div>
      }

      {/* Details Accordions */}
      <ProductDetailsAccordions accordions={productAccordions} />
    </div>
  );
});
function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;
  if (!image && !color) return <span className="text-sm font-medium">{name}</span>;
  return (
    <div
      aria-label={name}
      className="product-option-label-swatch w-full aspect-square flex items-center justify-center"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full object-cover" />}
    </div>
  );
}