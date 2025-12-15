// app/components/QuantitySelector.tsx
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
        {/* <div className="space-y-3">
          {pricingTiers.map((tier) => {
            const isSelected = selectedTier === tier.key;
            return (
              <label
                key={tier.key}
                className={`relative flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="quantity"
                    value={tier.key}
                    checked={isSelected}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="absolute opacity-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {tier.label}
                    </span>
                    {tier.subtext && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        {tier.subtext}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {tier.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {tier.oldPrice}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-gray-900">
                      {tier.price}
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
        </div> */}

        {/* Divider */}
        {/* <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div> */}

        {/* Custom Quantity Selector */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Pick a Custom Quantity
            </p>

            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 flex items-center justify-center text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200 rounded-full transition-colors shadow-sm"
                >
                  <Minus className="h-3 w-3" />
                </button>

                <span className="w-8 text-center text-sm font-medium text-gray-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 flex items-center justify-center text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200 rounded-full transition-colors shadow-sm"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* <div className="text-right">
                <span className="text-xs text-gray-500 block">Total</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(quantity * unitPrice)}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}