import type { MappedProductOptions } from "@shopify/hydrogen";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AedIcon } from '../ui/AedIcon';

const currencyOptions = {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const formatPrice = (amount: string) => {
  return new Intl.NumberFormat('en-US', currencyOptions).format(parseFloat(amount));
};

const calculateSavings = (price: string, compareAtPrice: string | null) => {
  if (!compareAtPrice) return null;
  const priceNum = parseFloat(price);
  const compareAtPriceNum = parseFloat(compareAtPrice);
  if (priceNum >= compareAtPriceNum) return null;

  const savings = compareAtPriceNum - priceNum;
  const percentage = Math.round((savings / compareAtPriceNum) * 100);

  return { amount: savings, percentage };
};

const ProductOptionDozen = ({ option }: { option: MappedProductOptions }) => {
  const navigate = useNavigate();
  const [singleDozenPrice, setSingleDozenPrice] = useState<number | null>(null);


  if (option.optionValues.length === 1 || option.name === 'Color') {
    return null;
  }

  useEffect(() => {
    setSingleDozenPrice(parseFloat(option?.optionValues[0]?.variant?.price?.amount || '0'))
  }, [option])

  // Find the best deal to highlight
  const bestDealValue = useMemo(() => {
    return option.optionValues.reduce((best, current) => {
      if (!current.variant?.price?.amount) return best;
      if (!best) return current;

      const currentPrice = parseFloat(current.variant.price.amount);
      const bestPrice = parseFloat(best.variant?.price?.amount || '0');

      return currentPrice < bestPrice ? current : best;
    }, option.optionValues[0]);
  }, [option.optionValues]);


  const getPricePerItem = (price: string, name: string, currencyCode: string) => {
    const numberOfItems = name.split(' ')[0];
    const priceNum = parseFloat(price);
    const pricePerItem = (priceNum / parseInt(numberOfItems)).toFixed(2)
    return `${formatPrice(pricePerItem, currencyCode)}/dz`;
  }

  const getOriginalDozenPrice = (name: string, currencyCode: string) => {
    const dozenSize = name.split(' ')[0];
    if (!singleDozenPrice) return null
    const originalPrice = singleDozenPrice * parseInt(dozenSize);
    return formatPrice(originalPrice.toFixed(2), currencyCode)
  }

  const getDozenSavedPrice = (name: string, price: string) => {
    const dozenSize = name.split(' ')[0];
    if (!singleDozenPrice) return null
    const originalPrice = singleDozenPrice * parseInt(dozenSize);
    return `${(originalPrice - parseFloat(price)).toFixed(2)}`;
  }

  return (
    <div key={option.name} className="space-y-2 my-2">
      <h5 className="text-sm font-medium text-gray-900">
        {option.name}:
      </h5>
      <div className="space-y-4">
        {option.optionValues.map((value, index) => {

          const pricePerDozenText = value.variant?.price?.amount ? getPricePerItem(value.variant.price.amount, value.name, value.variant.price.currencyCode) : null;
          const totalPriceText = value.variant?.price?.amount ? `$${formatPrice(value.variant.price.amount)}` : null;
          const originalPricePerDozenText = index === 0 || !singleDozenPrice ? null : `$${singleDozenPrice.toFixed(2)}/dz`;

          const {
            name,
            handle,
            variantUriQuery,
            selected,
            available,
            exists,
            isDifferentProduct,
          } = value;

          const optionContent = (
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        selected
                          ? 'border-black bg-white'
                          : 'border-gray-400 bg-white'
                      }`}
                    >
                      {selected && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center h-full">
                    <div className="relative">
                      <span className="text-sm font-semibold text-gray-900 leading-none">
                        {name}
                      </span>
                      {index === option?.optionValues?.length - 1 && (
                        <div className="absolute -top-6 left-0">
                          <span className="font-semibold bg-[#FFA500] text-black text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            Top Savings
                          </span>
                        </div>
                      )}
                    </div>

                    {index > 0 && totalPriceText && (
                      <div className="text-xs text-gray-400 mt-1">
                        {totalPriceText}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-bold text-gray-900">
                      {pricePerDozenText}
                    </div>
                    {originalPricePerDozenText && (
                      <div className="line-through text-xs text-gray-400 mt-0.5">
                        {originalPricePerDozenText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );

          if (isDifferentProduct) {
            return (
              <Link
                key={option.name + name}
                className={`relative flex items-center w-full p-3 rounded border transition-all duration-200 ${
                  selected
                    ? 'border-[#FFA500] bg-white ring-1 ring-[#FFA500]'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                } ${!available ? 'opacity-40 grayscale' : ''}`}
                prefetch="intent"
                preventScrollReset
                replace
                to={`/products/${handle}?${variantUriQuery}`}
              >
                {optionContent}
              </Link>
            );
          } else {
            return (
              <button
                key={option.name + name}
                type="button"
                className={`relative flex items-center w-full p-3 rounded border transition-all duration-200 ${
                  selected
                    ? 'border-[#FFA500] bg-white ring-1 ring-[#FFA500]'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                } ${!exists ? 'opacity-40 cursor-not-allowed' : ''}`}
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
                {optionContent}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};


export default ProductOptionDozen