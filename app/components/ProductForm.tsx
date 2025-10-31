// app/components/ProductForm.tsx (updated with imports)
import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {ProductPrice} from './ProductPrice';
import {ProductRating} from './ProductRating';
import {QuantitySelector} from './QuantitySelector';
import {ShippingInfo} from './ShippingInfo';
import {ProductDetailsAccordions} from './ProductDetailsAccordions';
import type {ProductFragment} from 'storefrontapi.generated';
import {useState, useEffect, useRef} from 'react';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1); // Default to 1 dozen
  const [selectedTier, setSelectedTier] = useState('1'); // For radio selection
  const formRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState('auto');

  // Quantity tiers (labels only, no pricing here)
  const pricingTiers = [
    { key: '1', label: '1 dozen' },
    { key: '3', label: '3 dozen' },
    { key: '6', label: '6 dozen' },
  ];

  const totalQuantityDozens = selectedTier === 'custom' ? quantity : parseInt(selectedTier);
  const unitPriceAmount = parseFloat(selectedVariant?.priceV2?.amount || '0');
  const unitCompareAmount = parseFloat(selectedVariant?.compareAtPriceV2?.amount || '0');
  const totalPriceAmount = unitPriceAmount * totalQuantityDozens;
  const totalCompareAmount = unitCompareAmount * totalQuantityDozens;
  const currencyCode = selectedVariant?.priceV2?.currencyCode || 'USD';
  const showCompare = unitCompareAmount > unitPriceAmount;

  // Custom quantity handler
  const handleCustomQuantity = (q: number) => {
    setQuantity(Math.max(1, q));
    if (selectedTier !== 'custom') {
      setSelectedTier('custom');
    }
  };

  const handleAddToCart = () => {
    open('cart');
  };

  // Dynamically set form height to match image height (assumes image ref passed or use window resize listener;
  // for simplicity, here we use a placeholder - in full impl, pass imageHeight prop or use ResizeObserver)
  useEffect(() => {
    // Placeholder: Assume image height is 600px; replace with actual measurement logic
    // e.g., if imageHeight prop: setFormHeight(`${imageHeight}px`);
    setFormHeight('600px'); // Match the fixed image height from screenshot/layout
  }, []);

  return (
    <div 
      ref={formRef}
      className="product-form"
      style={{
        height: formHeight,
        overflowY: 'auto',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        paddingRight: '8px', // Optional: scrollbar gutter space
      }}
    >
      {/* Product Price - total with compare if applicable */}
      <ProductPrice 
        price={{amount: totalPriceAmount.toFixed(2), currencyCode}} 
        compareAtPrice={showCompare ? {amount: totalCompareAmount.toFixed(2), currencyCode} : undefined} 
      />
      {showCompare && <span className="price-per-dozen">(${unitPriceAmount.toFixed(2)}/dozen)</span>}

      {/* Ratings Component */}
      <ProductRating rating={4.8} reviewCount={1145} />

      {/* Existing Product Options (e.g., Color Variants) */}
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;
        return (
          <div className="product-options" key={option.name}>
            <h5>{option.name}</h5>
            <div className="product-options-grid">
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
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
                      key={option.name + name}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
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
            <br />
          </div>
        );
      })}

      {/* Quantity Selector Component */}
      <QuantitySelector
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
        quantity={quantity}
        setQuantity={handleCustomQuantity}
        pricingTiers={pricingTiers}
      />

      {/* Add to Cart Button with quantity */}
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
        {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold out'}
      </AddToCartButton>

      {/* Shipping Info */}
      <ShippingInfo />

      {/* Details Accordions */}
      <ProductDetailsAccordions />
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
  if (!image && !color) return <span>{name}</span>;
  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}