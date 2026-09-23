import { useEffect, useState } from 'react';
import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const code = localStorage.getItem('featuredDiscountCode');
      if (code) setDiscountCode(code);
    } catch {
      // safe fallback if storage is restricted
    }
  }, []);

  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
        discountCode: discountCode || undefined,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          {discountCode && (
            <input
              name="discountCode"
              type="hidden"
              value={discountCode}
            />
          )}
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={`w-full ${disabled ? 'bg-[#e2e2e2] text-[#a1a1a1] cursor-not-allowed' : 'bg-black text-white cursor-pointer'} py-4 px-6 rounded-full font-medium text-base transition-all duration-300`}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
