import { type FetcherWithComponents, useRouteLoaderData } from 'react-router';
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
  const rootData = useRouteLoaderData<any>('root');
  const pathPrefix = rootData?.selectedLocale?.pathPrefix || '';
  const cartRoute = `${pathPrefix}/cart`;

  return (
    <CartForm route={cartRoute} inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
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
            className={`w-full ${disabled ? 'bg-[#e2e2e2] text-[#a1a1a1] cursor-not-allowed' : 'bg-black text-white cursor-pointer'} py-4 px-6 rounded-full font-medium text-base transition-all duration-300`}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
