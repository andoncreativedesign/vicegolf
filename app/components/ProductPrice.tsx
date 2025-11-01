// app/components/ProductPrice.tsx
import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

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
            <span className="text-3xl font-bold text-gray-900 tracking-tight">
              <Money data={price} />
            </span>
          ) : null}
          <s className="text-lg text-gray-500 font-medium">
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          <Money data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}