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
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className={`w-full ${disabled ? 'bg-[#e2e2e2] text-[#a1a1a1]' : 'bg-black text-white'} py-4 px-6 rounded-full font-medium text-base transition-all duration-300`}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
