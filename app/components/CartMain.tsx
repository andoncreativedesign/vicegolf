import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';

type CartMainProps = {
  cart: CartApiQueryFragment | null;
};

/**
 * The cart component used specifically for the aside/mini-cart view
 */
export function CartMain({ cart: originalCart }: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const { close } = useAside();
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className="cart-aside h-full flex flex-col">
      <div className="p-4 pb-2">
        <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
      </div>

      {!cartHasItems ? (
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