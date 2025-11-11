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
};

export function QuantitySelector({
  selectedTier,
  setSelectedTier,
  quantity,
  setQuantity,
  pricingTiers,
  ...props
}: Props) {
  return (
    <div className="w-full" {...props}>

      <div className="flex flex-col gap-3">
        {pricingTiers.map((tier, index) => {
          const isSelected = selectedTier === tier.key;
          return (
            <label
              key={tier.key}
              className={`relative flex items-center justify-between rounded-2xl border-2 cursor-pointer transition-all duration-300 px-5 py-4 group ${
                isSelected
                  ? 'border-amber-500 bg-amber-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              
              <div className="flex items-center gap-4">
                <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-300 bg-white'}`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
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
                  <span className="text-base font-semibold text-gray-900">
                    {tier.label}
                  </span>
                  {tier.subtext && (
                    <span className="text-sm text-gray-500 mt-0.5">{tier.subtext}</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-base font-bold text-gray-900">
                  {tier.price}
                </p>
                {tier.oldPrice && (
                  <p className="text-sm text-gray-400 line-through mt-0.5">
                    {tier.oldPrice}
                  </p>
                )}
              </div>
            </label>
          );
        })}

        {/* Custom Quantity Selector */}
        <div className="mt-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Pick a Custom Quantity</p>
            
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <div className="flex items-center h-10 px-2">
                <span className="w-12 text-center text-base font-medium text-gray-900">
                  {quantity}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10 flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-base font-semibold text-gray-900">
                ${(quantity * 39.99).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}