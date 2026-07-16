import { Minus, Plus } from 'lucide-react';
import type { ComponentProps } from 'react';

type Tier = {
  key: string;
  label: string;
  price: string;
  subtext?: string;
  oldPrice?: string;
  unitPrice?: string;
  oldUnitPrice?: string;
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
  // Find the tier with the lowest unit cost for the Top Savings badge
  let minUnitPrice = Infinity;
  let topSavingsKey = '';
  if (pricingTiers.length > 1) {
    pricingTiers.forEach((tier) => {
      const priceNum = parseFloat(tier.price.replace(/[^0-9.]/g, ''));
      const qty = parseInt(tier.key);
      const unitCost = priceNum / qty;
      // Use <= so if multiple tiers have the same lowest price, the larger volume gets the badge (optional, but < is safer to prioritize the first lowest)
      if (unitCost < minUnitPrice) {
        minUnitPrice = unitCost;
        topSavingsKey = tier.key;
      }
    });
  }

  return (
    <div className="w-full" {...props}>
      <div className="flex flex-col gap-4">
        {/* Pricing Tiers */}
        {pricingTiers.length > 0 && (
        <div className="flex flex-col">
          {pricingTiers.map((tier, index) => {
            const isSelected = selectedTier === tier.key;
            const isTopSavings = tier.key === topSavingsKey;
            const hasBadge = isTopSavings;
            
            // Calculate price per dozen
            const tierNum = parseInt(tier.key);
            const priceNum = parseFloat(tier.price.replace(/[^0-9.]/g, ''));
            const oldPriceNum = tier.oldPrice ? parseFloat(tier.oldPrice.replace(/[^0-9.]/g, '')) : (unitPrice * tierNum);     

            const formatMoney = (amount: number) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
              }).format(amount);
            };

            const totalPriceText = formatMoney(priceNum);
            
            let unitPriceText = '';
            let oldUnitPriceText = null;

            if (tier.unitPrice) {
                const uPrice = parseFloat(tier.unitPrice.replace(/[^0-9.]/g, ''));
                unitPriceText = formatMoney(uPrice);
                if (tier.label.includes('dozen')) unitPriceText += '/dz';
            }
            if (tier.oldUnitPrice) {
                const oUPrice = parseFloat(tier.oldUnitPrice.replace(/[^0-9.]/g, ''));
                oldUnitPriceText = formatMoney(oUPrice);
                if (tier.label.includes('dozen')) oldUnitPriceText += '/dz';
            }

            return (
              <label
                key={tier.key}
                className={`relative flex items-center justify-between w-full p-4 md:p-5 rounded border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-[#FFA500] bg-[#FFFDF6] ring-1 ring-[#FFA500]'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                } ${index > 0 ? (hasBadge ? 'mt-7' : 'mt-3') : ''}`}
              >
                {hasBadge && (
                  <div className="absolute -top-[15px] left-4 md:left-5">
                    <span className="font-bold bg-[#FFA500] text-black text-[14px] md:text-[15px] px-4 py-1.5 rounded-full whitespace-nowrap">
                      Top Savings
                    </span>
                  </div>
                )}
                
                <input
                  type="radio"
                  name="quantity"
                  value={tier.key}
                  checked={isSelected}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="absolute opacity-0"
                />
                
                <div className="flex items-center gap-4">
                  <div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-black bg-white'
                          : 'border-gray-400 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center h-full">
                    <div className="relative">
                      <span className="text-[17px] font-medium text-gray-900 leading-none">
                        {tier.label}
                      </span>
                    </div>
                    {tierNum > 1 && (
                      <div className="text-sm text-gray-500 mt-1">
                        {totalPriceText}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <div className="text-[17px] md:text-lg font-bold text-gray-900">
                      {unitPriceText || totalPriceText}
                    </div>
                    {oldUnitPriceText && (
                      <div className="line-through text-sm text-gray-400 mt-0.5">
                        {oldUnitPriceText}
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