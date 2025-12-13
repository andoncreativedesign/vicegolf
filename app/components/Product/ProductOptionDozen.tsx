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
    console.log("option for dozen", option.optionValues[0])
    console.log('\n\n')
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

          const pricePerDozen = index === 0 ? null :  getPricePerItem(value.variant?.price?.amount, value?.name, value.variant?.price?.currencyCode);
          const totalPrice = value.variant?.price?.amount
            ? formatPrice(value.variant.price.amount, value.variant.price.currencyCode)
            : null
          const originalPrice = index === 0 ? null : getOriginalDozenPrice(value.name, value.variant?.price?.currencyCode)
          const savings = index === 0 ? null : getDozenSavedPrice(value.name, value.variant.price.amount)

          const isBestDeal = value === bestDealValue && savings;
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

          const optionContent = (
            <div className="w-full">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 bg-white'
                        }`}
                    >
                      {selected && (
                        <div className="w-2.5 h-2.5 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900">
                        {name}
                      </span>
                      {index === option?.optionValues?.length - 1 && (
                        <div className="absolute -top-3 left-2">
                          <span className="font-semibold bg-yellow-300 text-black px-2 py-0.5 rounded-md border border-red-200">
                            Top Savings
                          </span>
                        </div>
                      )}
                    </div>

                    {pricePerDozen && (
                      <div className="text-sm text-gray-500 mt-0.5">
                        <span className="flex items-center">
                          <AedIcon className="mr-1" />
                          {pricePerDozen}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="relative">
                    {savings && (
                      <div className="absolute text-sm -top-7 -right-2 bg-[#DA1000] text-white font-semibold px-2 py-0.5 rounded-md border border-red-700 shadow-sm whitespace-nowrap">
                        Save <span className="flex items-center"><AedIcon className="mx-0.5" />{savings}</span>
                      </div>
                    )}
                    <div className={`text-lg font-bold ${index===0 ? 'text-gray-800' : 'text-[#DA1000]'}`}>
                      <span className="flex items-center">
                        <AedIcon className="mr-1" />
                        {formatPrice(value.variant.price.amount)}
                      </span>
                    </div>
                    {originalPrice && (
                      <div className="line-through text-sm text-gray-500">
                        <span className="flex items-center">
                          <AedIcon className="mr-1" />
                          {originalPrice}
                        </span>
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
                className={`relative flex items-start w-full p-4 rounded-xl border-2 transition-all duration-200 ${selected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${!available ? 'opacity-40 grayscale' : ''} ${isBestDeal ? 'ring-2 ring-yellow-400' : ''}`}
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
                className={`relative flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-200 ${selected
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${!exists ? 'opacity-40 cursor-not-allowed' : ''
                  } `}
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