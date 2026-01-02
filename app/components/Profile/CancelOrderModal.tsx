// Create a new file: app/components/Order/CancelOrderModal.tsx
import { useEffect, useRef, useState } from 'react';
import { useFetcher, useRevalidator } from 'react-router';
import showToast from '~/components/basic/CustomToast';


interface CancelOrderModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelOrderModal({ orderId, isOpen, onClose }: CancelOrderModalProps) {
  const [staffNote, setStaffNote] = useState('');
  const [refundMethod, setRefundMethod] = useState<'originalPaymentMethodsRefund' | 'giftCardRefund'>('originalPaymentMethodsRefund');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

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
    showToast.success('Your order cancellation request has been submitted.');
    revalidator.revalidate();
    onClose();
  }, [fetcher.state, fetcher.data, revalidator, onClose]);
  
  

  const handleSubmit = (e: React.FormEvent) => {
    if (!staffNote) return
    e.preventDefault();
    setIsSubmitting(true);

    fetcher.submit(
      {
        orderId, // already full GID
        staffNote: staffNote,
      },
      { method: "post", action: "/api/order/cancel" }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xs p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Cancel Order</h2>

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
            <label htmlFor="staffNote" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Cancellation
            </label>
            <textarea
              id="staffNote"
              value={staffNote}
              onChange={(e) => setStaffNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
              required
              placeholder="Please provide a reason for cancellation..."
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
              {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}