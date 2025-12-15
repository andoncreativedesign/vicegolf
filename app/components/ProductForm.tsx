// app/components/ProductForm.tsx (updated with imports)
import { Link, useLocation, useNavigate } from 'react-router';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import { ProductPrice } from './ProductPrice';
import { ProductRating } from './ProductRating';
import { QuantitySelector } from './QuantitySelector';
import { ShippingInfo } from './ShippingInfo';
import { ProductDetailsAccordions } from './ProductDetailsAccordions';
import type { ProductFragment } from 'storefrontapi.generated';
import { useState, useEffect, useRef } from 'react';
import type { AccordionItem } from '~/lib/sanity/products';
import type { UIColorVariant } from '~/lib/shopify/product-queries';
import ColorVariant from './Product/ColorVariant';
import ProductOptionDozen from './Product/ProductOptionDozen';
import type { ShippingDetails } from '~/lib/sanity/home';

export function ProductForm({
  productOptions,
  selectedVariant,
  title,
  description,
  productType,
  productAccordions,
  colorVariants,
  shippingDetails,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  title: string;
  description: string;
  productType?: string;
  productAccordions: AccordionItem[];
  colorVariants?: UIColorVariant[];
  shippingDetails?: ShippingDetails | null;
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState('1');
  const formRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState('auto');

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

  useEffect(() => {
    setFormHeight('600px');
  }, []);

  return (
    <div
      ref={formRef}
      className="product-form bg-white p-4 md:p-5 md:mx-24 scrollbar-hide w-full max-w-[500px] mx-auto"
      style={{
        height: formHeight,
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
    >
      {/* Product Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
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
          className="mb-6 text-gray-600 text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {/* Ratings
      <div className="mb-8">
        <ProductRating rating={4.8} reviewCount={1145} />
      </div> */}

      {/* Color Variants Section */}
      {colorVariants && colorVariants.length > 0 && (
        <ColorVariant
          productType={productType}
          colorVariants={colorVariants}
          selectedVariant={selectedVariant}
        />
      )}

      <div className="space-y-3">
        {productOptions.map((option, index) => {
          if (option.optionValues.length === 1) return null;
          if (option.name === 'Color') return null;
          if (option.name?.includes('pack size')) return null;
          /* if (option.name?.includes('pack size')) return <ProductOptionDozen
            key={index}
            option={option}

          /> */
          return (
            <div className="product-options mb-6" key={option.name}>
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                {option.name}:
              </h5>
              <div className="grid grid-cols-6 gap-2">
                {option.optionValues.map((value) => {
                  const {
                    name,
                    handle,
                    variantUriQuery,
                    selected,
                    available,
                    exists,
                    isDifferentProduct,
                    swatch,
                  } = value;

                  if (isDifferentProduct) {
                    return (
                      <Link
                        className={`product-options-item relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${selected ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'
                          } ${!available ? 'opacity-40 grayscale' : ''}`}
                        key={option.name + name}
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        type="button"
                        className={`product-options-item relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${selected ? 'ring-2 ring-black ring-offset-2' : 'ring-1 ring-gray-200'
                          } ${!exists ? 'opacity-40 cursor-not-allowed' : ''} ${!available ? 'grayscale' : ''
                          }`}
                        key={option.name + name}
                        disabled={!exists}
                        onClick={() => {
                          if (!selected) {
                            void navigate(`?${variantUriQuery}`, {
                              replace: true,
                              preventScrollReset: true,
                            });
                          }
                        }}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </button>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quantity Selector */}
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
          {selectedVariant?.availableForSale
            ? `Add to Cart • ${formatPrice(totalPriceAmount)}`
            : 'Sold out'}
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
}

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