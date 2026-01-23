import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/types/cart';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useEffect, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router';
import type { FetcherWithComponents } from 'react-router';

import { usePlusMember } from '~/hooks/usePlusMember';
import { AedIcon } from './ui/AedIcon';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart, layout }: CartSummaryProps) {
  const { isPlusMember, discountPercentage, discountAmount } = usePlusMember();
  const isPageLayout = layout === 'page';
  const subtotal = cart?.cost?.subtotalAmount;
  const total = cart?.cost?.totalAmount;

  const displayPercentage = (discountPercentage * 100).toFixed(0);

  return (
    <div
      aria-labelledby="cart-summary"
      className={`cart-summary ${isPageLayout ? 'cart-summary-page' : 'cart-summary-aside'}`}
    >
      <div className="summary-card px-4 py-2">
        <div className="space-y-3">
          <CartDiscounts discountCodes={cart?.discountCodes} />
          {/* <CartGiftCard giftCardCodes={cart?.appliedGiftCards} /> */}

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {subtotal?.amount ? <Money data={subtotal} /> : '-'}
            </span>
          </div>

          {isPlusMember && (discountPercentage > 0 || discountAmount > 0) && (
            <div className="flex justify-between items-center text-emerald-600 text-sm font-medium">
              <span className="flex items-center">
                Plus membership {discountAmount > 0 ? (
                  <span className="flex items-center mx-1">
                    <AedIcon className="w-3 h-3 mx-0.5" />
                    {discountAmount.toFixed(2)}
                  </span>
                ) : `${displayPercentage}%`} discount applied
              </span>
              <span>Automatic</span>
            </div>
          )}

          {total && (
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">
                  Total{' '}
                  <span className="text-gray-600 font-normal">
                    {subtotal?.amount === total.amount
                      ? '(Incl. taxes and excl. shipping)'
                      : '(Incl. taxes and shipping)'}
                  </span>
                </span>
                <span className="font-medium text-gray-900">
                  <Money data={total} />
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
        </div>

        {/* {isPageLayout && (
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors duration-200"
            >
              ← Continue Shopping
            </Link>
          </div>
        )} */}
      </div>
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl?: string }) {
  if (!checkoutUrl) return null;

  return (
    <div className="checkout-actions">
      <a
        href={checkoutUrl}
        target="_self"
        className="w-auto min-w-[200px] flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full !text-white bg-black hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md no-underline mb-3"
        style={{ textDecoration: 'none' }}
      >
        Checkout securely
      </a>
      <div className="flex justify-center items-center gap-3 mt-2">
        <img
          src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/mastercard-card.svg?v=1715242245&width=50&crop=center"
          srcSet="
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/mastercard-card.svg?v=1715242245&width=50&crop=center 1x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/mastercard-card.svg?v=1715242245&width=100&crop=center 2x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/mastercard-card.svg?v=1715242245&width=150&crop=center 3x
    "
          alt="Mastercard"
          className="h-6 w-auto"
        />
        <img
          src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/visa-card.svg?v=1715242244&width=50&crop=center"
          srcSet="
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/visa-card.svg?v=1715242244&width=50&crop=center 1x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/visa-card.svg?v=1715242244&width=100&crop=center 2x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/visa-card.svg?v=1715242244&width=150&crop=center 3x
    "
          alt="Visa"
          className="h-6 w-auto"
        />
        {/* <img
          src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/paypal-card_1.svg?v=1715242244&width=50&crop=center"
          srcSet="
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/paypal-card_1.svg?v=1715242244&width=50&crop=center 1x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/paypal-card_1.svg?v=1715242244&width=100&crop=center 2x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/paypal-card_1.svg?v=1715242244&width=150&crop=center 3x
    "
          alt="PayPal"
          className="h-6 w-auto"
        /> */}
        <img
          src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/applepay-card_1.svg?v=1715242244&width=50&crop=center"
          srcSet="
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/applepay-card_1.svg?v=1715242244&width=50&crop=center 1x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/applepay-card_1.svg?v=1715242244&width=100&crop=center 2x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/applepay-card_1.svg?v=1715242244&width=150&crop=center 3x
    "
          alt="Apple Pay"
          className="h-6 w-auto"
        />
        {/* <img
          src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/gpay_1.svg?v=1715242244&width=50&crop=center"
          srcSet="
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/gpay_1.svg?v=1715242244&width=50&crop=center 1x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/gpay_1.svg?v=1715242244&width=100&crop=center 2x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/gpay_1.svg?v=1715242244&width=150&crop=center 3x
    "
          alt="Google Pay"
          className="h-6 w-auto"
        /> */}
        <img
          src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=50&crop=center"
          srcSet="
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=50&crop=center 1x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=100&crop=center 2x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=150&crop=center 3x
    "
          alt="American Express"
          className="h-6 w-auto"
        />
      </div>

    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const [showInput, setShowInput] = useState(true);
  const codes: string[] = discountCodes?.filter((discount) => discount.applicable)?.map(({ code }) => code) || [];

  return (
    <div className="discount-section">
      {/* Display existing discounts */}
      {codes.length > 0 && (
        <div className="applied-discounts mb-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Volume discount</span>
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
      <div className="discount-input mt-2 w-ful">
        {!showInput && !codes.length ? (
          <button
            onClick={() => setShowInput(true)}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200 w-full text-left py-2"
          >
            + Add discount code
          </button>
        ) : (
          <UpdateDiscountForm discountCodes={codes} onSuccess={() => setShowInput(false)}>
            <div className="w-full">
              <div className="flex w-full gap-2 items-center">
                <input
                  type="text"
                  name="discountCode"
                  placeholder="Insert Promo Code"
                  className="flex-1 w-full px-3 py-2 border border-[#f0f0f0] bg-white rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150"
                />
                <button
                  type="submit"
                  className="px-4 h-10 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap flex items-center justify-center"
                >
                  Apply
                </button>
              </div>
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
  const [showInput, setShowInput] = useState(true);
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({ key: 'gift-card-add' });

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
      <div className="gift-card-input mt-2 w-full">
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200 w-full text-left py-2"
          >
            + Add gift card
          </button>
        ) : (
          <UpdateGiftCardForm
            giftCardCodes={appliedGiftCardCodes.current}
            saveAppliedCode={saveAppliedCode}
            fetcherKey="gift-card-add"
          >
            <div className="w-full">
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  name="giftCardCode"
                  placeholder="Gift card"
                  ref={giftCardCodeInput}
                  className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={giftCardAddFetcher.state !== 'idle'}
                  className="px-4 h-10 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap disabled:opacity-50 flex items-center justify-center"
                >
                  Apply
                </button>
              </div>
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