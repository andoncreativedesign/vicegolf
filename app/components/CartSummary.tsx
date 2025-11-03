import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import type {FetcherWithComponents} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const isPageLayout = layout === 'page';
  
  return (
    <div aria-labelledby="cart-summary" className={`cart-summary ${isPageLayout ? 'cart-summary-page' : 'cart-summary-aside'}`}>
      <div className="summary-card bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {cart?.cost?.subtotalAmount?.amount ? (
                <Money data={cart?.cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </span>
          </div>
          
          <CartDiscounts discountCodes={cart?.discountCodes} />
          <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
          
          {cart?.cost?.totalAmount && (
            <>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    <Money data={cart.cost.totalAmount} />
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Taxes and shipping calculated at checkout</p>
              </div>
            </>
          )}
        </div>
        
        <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
        
        {isPageLayout && (
          <div className="mt-6 text-center">
            <Link 
              to="/collections" 
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors duration-200"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="checkout-actions">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        Proceed to Checkout
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const [showInput, setShowInput] = useState(false);
  const codes: string[] = discountCodes?.filter((discount) => discount.applicable)?.map(({code}) => code) || [];

  return (
    <div className="discount-section">
      {/* Display existing discounts */}
      {codes.length > 0 && (
        <div className="applied-discounts mb-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Discount{sodes.length > 1 ? 's' : ''}</span>
            <UpdateDiscountForm>
              <button 
                type="submit"
                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                Remove
              </button>
            </UpdateDiscountForm>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {codes.map((code) => (
              <span key={code} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {code}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Discount input form */}
      <div className="discount-input">
        {!showInput && !codes.length ? (
          <button
            onClick={() => setShowInput(true)}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
          >
            + Add discount code
          </button>
        ) : (
          <UpdateDiscountForm discountCodes={codes} onSuccess={() => setShowInput(false)}>
            <div className="flex gap-2">
              <input 
                type="text" 
                name="discountCode" 
                placeholder="Enter discount code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors duration-200"
              >
                Apply
              </button>
            </div>
          </UpdateDiscountForm>
        )}
      </div>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
  onSuccess,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
  onSuccess?: () => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
      onSuccess={onSuccess}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const [showInput, setShowInput] = useState(false);
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
      setShowInput(false);
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, '');
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div className="gift-card-section">
      {/* Display applied gift cards */}
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div className="applied-gift-cards mb-3">
          <span className="text-gray-600 text-sm">Gift Card(s)</span>
          <div className="space-y-2 mt-2">
            {giftCardCodes.map((giftCard) => (
              <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      ***{giftCard.lastCharacters}
                    </span>
                    <span className="text-sm text-green-600">
                      <Money data={giftCard.amountUsed} />
                    </span>
                  </div>
                  <button 
                    type="submit"
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </RemoveGiftCardForm>
            ))}
          </div>
        </div>
      )}

      {/* Gift card input form */}
      <div className="gift-card-input">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
          >
            + Add gift card
          </button>
        ) : (
          <UpdateGiftCardForm
            giftCardCodes={appliedGiftCardCodes.current}
            saveAppliedCode={saveAppliedCode}
            fetcherKey="gift-card-add"
          >
            <div className="flex gap-2">
              <input
                type="text"
                name="giftCardCode"
                placeholder="Enter gift card code"
                ref={giftCardCodeInput}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button 
                type="submit" 
                disabled={giftCardAddFetcher.state !== 'idle'}
                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 disabled:opacity-50 transition-colors duration-200"
              >
                Apply
              </button>
            </div>
          </UpdateGiftCardForm>
        )}
      </div>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  fetcherKey,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}