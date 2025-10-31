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
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-base font-semibold text-gray-900 mb-4">
            Pick a Custom Quantity
          </p>

          <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 text-center text-lg font-bold text-gray-900 bg-transparent outline-none"
                />
                <span className="ml-2 text-base text-gray-600 font-medium">dozen</span>
              </div>

              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="text-lg font-bold text-gray-900">
                ${(quantity * 39.99).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}