import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

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
    <li key={id} className="cart-line group flex gap-4 py-6 border-b border-gray-100 last:border-b-0 transition-colors duration-200 hover:bg-gray-50 px-4 rounded-lg">
      {image && (
        <Link
          to={lineItemUrl}
          onClick={() => layout === 'aside' && close()}
          className="flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg border border-gray-200 transition-transform duration-200 hover:scale-105"
        >
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </Link>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <Link
                prefetch="intent"
                to={lineItemUrl}
                className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200 line-clamp-2"
                onClick={() => layout === 'aside' && close()}
              >
                {product.title}
              </Link>
              
              {selectedOptions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedOptions.map((option) => (
                    <span 
                      key={option.name}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {option.name}: {option.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                <ProductPrice price={line?.cost?.totalAmount} />
              </div>
              {line?.cost?.totalAmount?.amount !== line?.cost?.compareAtAmount?.amount && (
                <div className="text-sm text-gray-500 line-through mt-1">
                  <ProductPrice price={line?.cost?.compareAtAmount} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <CartLineQuantity line={line} />
            <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
          </div>
        </div>
      </div>
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-2">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </CartLineUpdateButton>
      
      <span className="w-6 text-center text-sm font-medium text-gray-900">
        {quantity}
      </span>
      
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

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
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
        disabled={disabled} 
        type="submit"
        aria-label="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
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

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}