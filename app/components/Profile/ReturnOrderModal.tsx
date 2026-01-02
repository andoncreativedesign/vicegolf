// Create a new file: app/components/Order/CancelOrderModal.tsx
import type { Fulfillment } from '@shopify/hydrogen/storefront-api-types';
import type { OrderLineItemFullFragment } from 'customer-accountapi.generated';
import { useEffect, useRef, useState } from 'react';
import { useFetcher, useRevalidator } from 'react-router';
import showToast from '~/components/basic/CustomToast';
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

interface ReturnOrderModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  lineItems: OrderLineItemFullFragment[];
  fulfillments: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
}

export function ReturnOrderModal({ orderId, isOpen, onClose, lineItems, fulfillments }:  ReturnOrderModalProps) {
  const [staffNote, setStaffNote] = useState('');
  const [refundMethod, setRefundMethod] = useState<'originalPaymentMethodsRefund' | 'giftCardRefund'>('originalPaymentMethodsRefund');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [selectedItems, setSelectedItems] = useState<Map<string, { quantity: number; reason: string }>>(new Map());

  const getErrorMessage = (data: any): string | null => {
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors[0].message;
    }

    if (typeof data?.error === 'string') {
      return data.error;
    }

    if (data?.error?.message) {
      return data.error.message;
    }

    return null;
  };

  // useEffect(() => {
  //   if (isOpen && lineItems.length > 0) {
  //     const allItems = new Map<string, { quantity: number; reason: string }>();
  //     lineItems.forEach((item) => {
  //       allItems.set(item.id, {
  //         quantity: item.quantity,
  //         reason: 'WRONG_SIZE' // Default reason
  //       });
  //     });
  //     setSelectedItems(allItems);
  //   }
  // }, [isOpen, lineItems]);


  const prevFetcherState = useRef(fetcher.state);
  useEffect(() => {
    const justFinished =
      prevFetcherState.current !== 'idle' &&
      fetcher.state === 'idle';
    prevFetcherState.current = fetcher.state;
    if (!justFinished) return;

    setIsSubmitting(false);
    const data = fetcher.data;
    if (!data) return;

    // ❌ Error
    const errorMessage = getErrorMessage(data);
    if (errorMessage) {
      showToast.error(errorMessage);
      onClose();
      return;
    }

    // ✅ Success
    showToast.success('Your order return request has been submitted.');
    revalidator.revalidate();
    onClose();
  }, [fetcher.state, fetcher.data, revalidator, onClose]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    // In API route, add debug logging
    e.preventDefault();

    if (!staffNote.trim()) {
      showToast.error('Please provide a reason for the return');
      return;
    }

    setIsSubmitting(true);

    try {
      fetcher.submit(
        {
          orderId,
          staffNote: staffNote.trim(),
        },
        {
          method: 'post',
          action: '/api/order/return',
        }
      );
    } catch (error) {
      console.error('[ReturnOrderModal] Submit error:', error);
      showToast.error('Failed to submit return request');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xs p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Return Order</h2>

        {/* <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="refundMethod"
                  value="originalPaymentMethodsRefund"
                  checked={refundMethod === 'originalPaymentMethodsRefund'}
                  onChange={() => setRefundMethod('originalPaymentMethodsRefund')}
                  className="mr-2"
                />
                Original Payment Method
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="staffNote" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Return
            </label>
            <textarea
              id="staffNote"
              value={staffNote}
              onChange={(e) => setStaffNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              required
              placeholder="Please provide a reason for return..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-block bg-black p-2 rounded-xs text-white cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-block bg-black p-2 rounded-xs text-white cursor-pointer"
              disabled={isSubmitting || !staffNote.trim()}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Return'}
            </button>
          </div>
        </form> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="refundMethod"
                  value="originalPaymentMethodsRefund"
                  checked={refundMethod === 'originalPaymentMethodsRefund'}
                  onChange={() => setRefundMethod('originalPaymentMethodsRefund')}
                  className="mr-2"
                />
                Original Payment Method
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="returnReason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Return
            </label>
            <select
              id="returnReason"
              value={staffNote}
              onChange={(e) => setStaffNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 bg-white text-gray-900 
             focus:ring-2 focus:ring-black focus:border-black 
             hover:border-gray-400 transition-colors duration-200
             cursor-pointer"

              required
            >
              <option value="">Please select a reason</option>
              <option value="SIZE_TOO_SMALL">Size Too Small</option>
              <option value="SIZE_TOO_LARGE">Size Too Large</option>
              <option value="DEFECTIVE">Defective Product</option>
              <option value="DAMAGED">Damaged in Transit</option>
              <option value="NOT_AS_DESCRIBED">Not as Described</option>
              <option value="NO_LONGER_NEEDED">No Longer Needed</option>
              <option value="WRONG_ITEM">Wrong Item Received</option>
              <option value="BETTER_PRICE_AVAILABLE">Better Price Available</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-block bg-black p-2 rounded-xs text-white cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-block bg-black p-2 rounded-xs text-white cursor-pointer"
              disabled={isSubmitting || !staffNote.trim()}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}