// app/components/QuantitySelector.tsx
import type { ComponentProps } from 'react';

type Tier = {
  key: string;
  label: string;
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
    <div className="quantity-selector" {...props}>
      <h5>Quantity</h5>
      <div className="quantity-options">
        {pricingTiers.map((tier) => (
          <label key={tier.key} className={`quantity-option ${selectedTier === tier.key ? 'selected' : ''}`}>
            <input
              type="radio"
              name="quantity"
              value={tier.key}
              checked={selectedTier === tier.key}
              onChange={(e) => setSelectedTier(e.target.value)}
            />
            <span>{tier.label}</span>
          </label>
        ))}
        <div className="custom-quantity">
          <label>Pick a custom quantity</label>
          <div className="quantity-input">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
            <span>dozen</span>
          </div>
        </div>
      </div>
    </div>
  );
}