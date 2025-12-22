import { useOptimisticCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';

type CartPageProps = {
  cart: CartApiQueryFragment | null;
};

/**
 * Full-page cart view with two-column layout
 * Items on the left, checkout summary on the right
 */
export function CartPage({ cart: originalCart }: CartPageProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className="cart-page mx-4 md:mx-10 min-h-[calc(66vh-200px)]">
      {!cartHasItems ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
         <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
         style={{color: 'white' , textDecoration: 'none' }}>
          Continue Shopping
          </a>
        </div>
      ) : (
        <div className="cart-container grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Cart Items */}
          <div className="cart-items px-8">
            <ul className="space-y-6">
              {cart?.lines?.nodes.map((line) => (
                <li key={line.id}>
                  <CartLineItem
                    line={line}
                    layout="page"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Order Summary */}
          <div className="cart-summary-container h-full">
              <div className="sticky top-24 bg-[#f0f0f0] p-6 rounded-lg">
              <CartSummary cart={cart} layout="page" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
