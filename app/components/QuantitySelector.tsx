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
    <div className="w-full max-w-lg" {...props}>
      <h5 className="text-base font-semibold text-gray-900 mb-3">
        Save Big With Vice
      </h5>

      <div className="flex flex-col gap-3">
        {pricingTiers.map((tier) => {
          const isSelected = selectedTier === tier.key;
          return (
            <label
              key={tier.key}
              className={`flex items-center justify-between rounded-xl border cursor-pointer transition-all duration-200 px-4 py-3 
                ${
                  isSelected
                    ? 'border-[#f0c040] bg-[#fffbea]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="quantity"
                  value={tier.key}
                  checked={isSelected}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="accent-black h-4 w-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {tier.label}
                  </span>
                  {tier.subtext && (
                    <span className="text-xs text-gray-500">{tier.subtext}</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {tier.price}
                </p>
                {tier.oldPrice && (
                  <p className="text-xs text-gray-400 line-through">
                    {tier.oldPrice}
                  </p>
                )}
              </div>
            </label>
          );
        })}

        {/* Custom Quantity Selector */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 mb-2">
            Pick a Custom Quantity
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="flex items-center border border-gray-200 rounded-full px-4 py-1.5">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-10 text-center text-sm font-medium text-gray-900 outline-none"
              />
              <span className="ml-1 text-sm text-gray-600">dozen</span>
            </div>

            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
