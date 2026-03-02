import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/types/cart';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useEffect, useRef, useState } from 'react';
import { Link, useFetcher } from 'react-router';
import type { FetcherWithComponents } from 'react-router';
import { AedIcon } from './ui/AedIcon';
import { useMembership } from '~/hooks/useMembership';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart, layout }: CartSummaryProps) {
  const { isMember, discountPercentage, discountAmount, membershipDiscount, getBestDiscountForProduct } = useMembership();
  const isPageLayout = layout === 'page';
  const subtotal = cart?.cost?.subtotalAmount;
  const originalTotal = cart?.cost?.totalAmount;

  // Calculate line-level original sum and expected discounted sum
  let lineOriginalSum = 0;
  let lineExpectedDiscountedSum = 0;

  cart?.lines?.nodes?.forEach((line: any) => {
    const cost = line?.cost;
    const merchandise = line?.merchandise;
    if (!cost || !merchandise) return;

    const basePrice = parseFloat(cost.amountPerQuantity?.amount || merchandise.price?.amount || '0');
    const quantity = line.quantity || 1;
    const lineBaseTotal = basePrice * quantity;

    const productCollections = merchandise.product?.collections?.nodes?.map((c: any) => c.id) || [];
    const { percentage, amount } = getBestDiscountForProduct(merchandise.product.id, productCollections, basePrice);

    let lineExpectedTotal = lineBaseTotal;

    const discountSum = line?.discountAllocations?.reduce((sum: number, d: any) => sum + parseFloat(d.discountedAmount.amount), 0) || 0;
    const shopifyLineTotal = parseFloat(cost.totalAmount?.amount || '0');

    if (shopifyLineTotal < lineBaseTotal) {
      // Shopify has already applied a discount to this line
      lineExpectedTotal = shopifyLineTotal;
    } else {
      // Apply our local frontend discount
      if (amount > 0) {
        lineExpectedTotal = Math.max(0, (basePrice - amount) * quantity);
      } else if (percentage > 0) {
        lineExpectedTotal = basePrice * (1 - percentage) * quantity;
      }
    }

    lineOriginalSum += lineBaseTotal;
    lineExpectedDiscountedSum += lineExpectedTotal;
  });

  const shopifySubtotalVal = subtotal?.amount ? parseFloat(subtotal.amount.replace(/,/g, '')) : 0;
  const shopifyTotalVal = originalTotal?.amount ? parseFloat(originalTotal.amount.replace(/,/g, '')) : 0;

  // Our accurate total takes the lowest of Shopify's total OR our manually calculated discounted sum
  // This shields us from Shopify Cart API delays
  let currentSubtotalVal = Math.min(shopifySubtotalVal, lineExpectedDiscountedSum);
  let totVal = Math.min(shopifyTotalVal, lineExpectedDiscountedSum + (shopifyTotalVal - shopifySubtotalVal)); // maintain any taxes/shipping added in total

  // Base value for display
  let baseVal = Math.max(lineOriginalSum, currentSubtotalVal);

  // Fallback: If no discount detected yet but user is member, they might have a hidden tier discount (legacy fallback)
  if (baseVal <= totVal && isMember && (membershipDiscount?.percentage || 0) > 0) {
    baseVal = totVal / (1 - membershipDiscount.percentage);
  }

  let actualPercentage = 0;
  let actualAmount = 0;

  if (baseVal > totVal) {
    actualPercentage = Math.round((1 - (totVal / baseVal)) * 100) / 100;
    actualAmount = Math.max(0, baseVal - totVal);
  }

  const displayPercentage = (actualPercentage * 100).toFixed(0);

  // Create overridden subtotal/total objects for Money component
  const displaySubtotal = subtotal ? { ...subtotal, amount: String(currentSubtotalVal) } : undefined;
  const displayTotal = originalTotal ? { ...originalTotal, amount: String(totVal) } : undefined;

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
            <div className="flex flex-col items-end">
              <span className="font-medium text-gray-900">
                {displaySubtotal?.amount ? <Money data={displaySubtotal} /> : '-'}
              </span>
              {baseVal > currentSubtotalVal && (
                <span className="text-xs text-gray-400 line-through">
                  <Money data={{ amount: baseVal.toFixed(2), currencyCode: subtotal!.currencyCode }} />
                </span>
              )}
            </div>
          </div>

          {(actualPercentage > 0 || actualAmount > 0) && (
            <div className="flex justify-between items-center text-emerald-600 text-sm font-medium">
              <span className="flex items-center">
                {isMember ? 'Membership' : 'Savings'} {actualAmount > 0 ? (
                  <span className="flex items-center mx-1">
                    <AedIcon className="w-3 h-3 mx-0.5" />
                    {actualAmount.toFixed(2)}
                  </span>
                ) : `${displayPercentage}%`} discount applied
              </span>
              <span>Automatic</span>
            </div>
          )}


          {displayTotal && (
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">
                  Total{' '}
                  <span className="text-gray-600 font-normal">
                    {subtotal?.amount === displayTotal.amount
                      ? '(Incl. taxes and excl. shipping)'
                      : '(Incl. taxes and shipping)'}
                  </span>
                </span>
                <span className="font-medium text-gray-900">
                  <Money data={displayTotal} />
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
        className="w-auto min-w-[200px] flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full !text-white bg-black hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md no-underline mb-3 cursor-pointer"
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
        {/* <img
          src="https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=50&crop=center"
          srcSet="
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=50&crop=center 1x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=100&crop=center 2x,
      https://cdn.shopify.com/s/files/1/0835/8445/0850/files/amex-card.svg?v=1715242244&width=150&crop=center 3x
    "
          alt="American Express"
          className="h-6 w-auto"
        /> */}
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

  const applyFetcher = useFetcher({ key: 'discount-apply' });
  const isApplying = applyFetcher.state !== 'idle';

  useEffect(() => {
    if (applyFetcher.state === 'idle' && applyFetcher.data && !applyFetcher.data.errors) {
      setShowInput(false);
    }
  }, [applyFetcher.state, applyFetcher.data]);

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
                className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors duration-200 cursor-pointer"
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
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200 w-full text-left py-2 cursor-pointer"
          >
            + Add discount code
          </button>
        ) : (
          <UpdateDiscountForm
            fetcherKey="discount-apply"
            discountCodes={codes}
          >
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
                  disabled={isApplying}
                  className="px-4 h-10 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                >
                  {isApplying ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Applying...</span>
                    </div>
                  ) : (
                    'Apply'
                  )}
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
  fetcherKey,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
  onSuccess?: () => void;
  fetcherKey?: string;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
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
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200 cursor-pointer"
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
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200 w-full text-left py-2 cursor-pointer"
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
                  className="px-4 h-10 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap disabled:opacity-50 flex items-center justify-center cursor-pointer"
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