import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li key={id} className="cart-line flex gap-4 py-6 border-b border-gray-200 last:border-b-0">
      {image && (
        <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md border border-gray-200">
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1">
        <div className="flex flex-col h-full">
          <div className="flex justify-between">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              className="text-base font-semibold text-gray-900 hover:text-gray-600"
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
            >
              {product.title}
            </Link>
            <div className="ml-4 text-sm font-medium text-gray-900">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>
          </div>

          {selectedOptions.length > 0 && (
            <div className="mt-1 text-sm text-gray-500">
              {selectedOptions.map((option) => (
                <div key={option.name}>
                  {option.name}: {option.value}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex-1 flex items-end justify-between">
            <CartLineQuantity line={line} />
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center border border-gray-300 rounded-md">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:bg-transparent"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            <span className="text-lg">−</span>
          </button>
        </CartLineUpdateButton>
        
        <span className="w-8 text-center text-sm font-medium">
          {quantity}
        </span>
        
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:bg-transparent"
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
          >
            <span className="text-lg">+</span>
          </button>
        </CartLineUpdateButton>
      </div>
      
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button 
        className="text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
        disabled={disabled} 
        type="submit"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
