// app/components/ProductPrice.tsx
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {AedIcon} from './ui/AedIcon';

const currencyOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale flex items-baseline gap-3">
          {price ? (
            <span className="text-base font-medium text-gray-900 flex items-center">
              <AedIcon />
              {new Intl.NumberFormat('en-US', currencyOptions).format(parseFloat(price.amount))}
            </span>
          ) : null}
          <s className="text-sm text-gray-500 line-through">
            {new Intl.NumberFormat('en-US', currencyOptions).format(parseFloat(compareAtPrice.amount))}
          </s>
        </div>
      ) : price ? (
        <span className="text-base font-medium text-gray-900 flex items-center">
          <AedIcon />
          {new Intl.NumberFormat('en-US', currencyOptions).format(parseFloat(price.amount))}
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}