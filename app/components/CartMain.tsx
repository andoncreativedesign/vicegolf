import { useOptimisticCart } from '@shopify/hydrogen';
import { Link, useNavigation } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';

type CartMainProps = {
  cart: CartApiQueryFragment | null;
};

/**
 * Skeleton loader shown while the cart is re-fetching after a country switch.
 */
function CartSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse px-4 pt-2">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-4 py-4 border-b border-gray-100">
          <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-2" />
          </div>
        </div>
      ))}
      <div className="mt-auto border-t border-gray-200 pt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded w-full mt-2" />
      </div>
    </div>
  );
}

/**
 * The cart component used specifically for the aside/mini-cart view
 */
export function CartMain({ cart: originalCart }: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const { close } = useAside();
  const navigation = useNavigation();

  // While navigating between locales (country switch), show a skeleton
  // instead of the "empty cart" flash. The cart is not actually empty —
  // it's just waiting for the new locale's server data to arrive.
  const isNavigating = navigation.state !== 'idle';
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className="cart-aside h-full flex flex-col">
      <div className="p-4 pb-2">
        <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
      </div>

      {isNavigating && !cartHasItems ? (
        <CartSkeleton />
      ) : !cartHasItems ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            to="/"
            onClick={close}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black cursor-pointer"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <ul className="space-y-4">
              {cart?.lines?.nodes.map((line) => (
                <li key={line.id}>
                  <CartLineItem line={line} layout="aside" />
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 p-4 bg-white">
            <CartSummary cart={cart} layout="aside" />
          </div>
        </div>
      )}
    </div>
  );
}