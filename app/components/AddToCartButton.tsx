import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

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
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
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
            className="w-full max-w-[800px]  bg-black text-white py-3 px-4 rounded-full font-medium text-sm md:text-base transition-all duration-300
                      hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                      disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
