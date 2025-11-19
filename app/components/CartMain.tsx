import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount = cart && Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      {cartHasItems && (
        <div className="cart-details">
          <div className="cart-content">
            <div className="cart-items" aria-labelledby="cart-lines">
              <div className="cart-header"></div>
              <ul className="cart-lines">
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </ul>
            </div>
          </div>
          <div className="cart-summary">
            <CartSummary cart={cart} layout={layout} />
          </div>
        </div>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const { close } = useAside();

  return (
    <div hidden={hidden} className="empty-cart text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="empty-cart-icon mb-6">
          <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m5.5-5.5h5.5m-5.5 0V19a2 2 0 104 0v-1.5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything yet, let's get you started!
        </p>
        <div className="w-full flex justify-center">
          <Link
            to="/collections"
            onClick={close}
            prefetch="viewport"
            className="flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-full !text-white bg-black hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md no-underline"
            style={{ textDecoration: 'none', maxWidth: 'fit-content' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}