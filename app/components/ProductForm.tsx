import { useNavigate } from 'react-router';
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
import type { ShippingDetails } from '~/lib/sanity/home';
import { AedIcon } from './ui/AedIcon';
import ProductCustomization from './basic/ProductCustomization';
export const ProductForm = forwardRef<HTMLDivElement, {
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
  bundleBtn: {
    text: string;
    handle: string;
  } | null
}>(({
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
}, ref) => {
  const navigate = useNavigate();
  const { open } = useAside();
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState('1');
  const totalQuantityDozens = selectedTier === 'custom' ? quantity : parseInt(selectedTier);
  const unitPriceAmount = parseFloat(selectedVariant?.price?.amount || '0');
  const unitCompareAmount = parseFloat(selectedVariant?.compareAtPrice?.amount || '0');
  const totalPriceAmount = unitPriceAmount * totalQuantityDozens;
  const totalCompareAmount = unitCompareAmount * totalQuantityDozens;
  const currencyCode = selectedVariant?.price?.currencyCode || 'USD';
  const showCompare = unitCompareAmount > unitPriceAmount;
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };
  const pricingTiers = [
    {
      key: '1',
      label: '1 dozen',
      price: formatPrice(unitPriceAmount),
      oldPrice: showCompare ? formatPrice(unitCompareAmount) : undefined
    },
    {
      key: '3',
      label: '3 dozen',
      price: formatPrice(unitPriceAmount * 3),
      oldPrice: showCompare ? formatPrice(unitCompareAmount * 3) : undefined
    },
    {
      key: '6',
      label: '6 dozen',
      price: formatPrice(unitPriceAmount * 6),
      oldPrice: showCompare ? formatPrice(unitCompareAmount * 6) : undefined
    },
  ];
  const handleCustomQuantity = (q: number) => {
    setQuantity(Math.max(1, q));
    if (selectedTier !== 'custom') {
      setSelectedTier('custom');
    }
  };
  const handleAddToCart = () => {
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
          <span className="text-sm text-emerald-600 font-medium ml-2">
            (Save ${(totalCompareAmount - totalPriceAmount).toFixed(2)})
          </span>
        )}
      </div>

      {/* Product Description */}
      {description && (
        <div
          className="product-description mb-6 text-gray-600 text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {/* Color Variants Section */}
      {colorVariants && colorVariants.length > 0 && (
        <ColorVariant
          productType={productType?.toLowerCase()}
          colorVariants={colorVariants}
          selectedVariant={selectedVariant}
        />
      )}

      {<ProductCustomization
        productOptions={productOptions}
        styling={getProductCustomizationStyleType(productType)}
        clubVariants={clubVariants}
        currentProductId={currentProductId}
      />
      }

      {/* Quantity Selector - Only show for products that need quantity selection */}
      {shouldShowQuantitySelector(productType) && (
        <div className="mb-6">
          <QuantitySelector
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            quantity={quantity}
            setQuantity={handleCustomQuantity}
            pricingTiers={pricingTiers}
            unitPrice={unitPriceAmount}
            currencyCode={currencyCode}
          />
        </div>
      )}

      {bundleBtn && (
        <div className="mb-6 md:max-w-[399px]">
          <button
            className="w-full cursor-pointer bg-white text-black border border-black py-4 px-6 rounded-full font-medium text-base transition-all duration-300"
            onClick={(e) => handleBundleBtnClick(e)}
          >
            {bundleBtn?.text || 'not text'}
          </button>
        </div>
      )}

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