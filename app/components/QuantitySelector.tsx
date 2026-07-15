import { Minus, Plus } from 'lucide-react';
import type { ComponentProps } from 'react';

type Tier = {
  key: string;
  label: string;
  price: string;
  subtext?: string;
  oldPrice?: string;
};

type Props = ComponentProps<'div'> & {
  selectedTier: string;
  setSelectedTier: (tier: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  pricingTiers: Tier[];
  unitPrice: number;
  currencyCode: string;
};

export function QuantitySelector({
  selectedTier,
  setSelectedTier,
  quantity,
  setQuantity,
  pricingTiers,
  unitPrice,
  currencyCode,
  ...props
}: Props) {
  return (
    <div className="w-full" {...props}>
      <div className="flex flex-col gap-4">
        {/* Pricing Tiers */}
        {/* Pricing Tiers */}
        {pricingTiers.length > 0 && (
        <div className="space-y-4">
          {pricingTiers.map((tier, index) => {
            const isSelected = selectedTier === tier.key;
            const isTopSavings = index === pricingTiers.length - 1;
            
            // Calculate price per dozen
            const tierNum = parseInt(tier.key);
            const priceNum = parseFloat(tier.price.replace(/[^0-9.]/g, ''));
            const oldPriceNum = tier.oldPrice ? parseFloat(tier.oldPrice.replace(/[^0-9.]/g, '')) : (unitPrice * tierNum);     
            // Use total price instead of per-dozen price
            const displayPrice = priceNum;
            const displayOldPrice = oldPriceNum > priceNum ? oldPriceNum : null;

            const formatMoney = (amount: number) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
              }).format(amount);
            };

            const priceText = formatMoney(displayPrice);
            const originalPriceText = displayOldPrice ? formatMoney(displayOldPrice) : null;

            return (
              <label
                key={tier.key}
                className={`relative flex items-center justify-between w-full p-3 rounded border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-[#FFA500] bg-white ring-1 ring-[#FFA500]'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="quantity"
                  value={tier.key}
                  checked={isSelected}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="absolute opacity-0"
                />
                
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-black bg-white'
                          : 'border-gray-400 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center h-full">
                    <div className="relative">
                      <span className="text-sm font-semibold text-gray-900 leading-none">
                        {tier.label}
                      </span>
                      {isTopSavings && pricingTiers.length > 1 && (
                        <div className="absolute -top-6 left-0">
                          <span className="font-semibold bg-[#FFA500] text-black text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            Top Savings
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-bold text-gray-900">
                      {priceText}
                    </div>
                    {originalPriceText && (
                      <div className="line-through text-xs text-gray-400 mt-0.5">
                        {originalPriceText}
                      </div>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        )}

        {/* Divider */}
        {pricingTiers.length > 0 && (
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        )}

        {/* Custom Quantity Selector */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Pick a Custom Quantity
            </p>

            <div className="flex items-center justify-between p-3 rounded-lg ">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 flex items-center justify-center text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200 rounded-full transition-colors shadow-sm cursor-pointer"
                >
                  <Minus className="h-3 w-3" />
                </button>

                <span className="w-8 text-center text-sm font-medium text-gray-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 flex items-center justify-center text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200 rounded-full transition-colors shadow-sm cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}